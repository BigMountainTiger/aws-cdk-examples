const HTTPResponse = require('../HTTPResponse');

const get_jira_accountId_by_email = require('/opt/nodejs/utilities/get-jira-accountId-by-email');
const jira_mapper = require('/opt/nodejs/utilities/jira-mapper');
const jira_create_ticket = require('/opt/nodejs/utilities/jira_create_ticket');

const parse_body = (body) => {
  body = (body || '').trim();
  if (!body) {
    throw 'Need the data to create the ticket';
  }

  try {
    const jBody = JSON.parse(body);
    const request = { user: {}, request: {} };

    request.type = (jBody.type || '').trim();
    request.user.email = ((jBody.user || {}).email || '').trim();

    const r = jBody.request || {};
    request.request.summary = (r.summary || '').trim();
    request.request.description = (r.description || '').trim();
    request.request.request_type = (r.request_type || '').trim();
    request.request.affected_application = (r.affected_application || '').trim();
    request.request.priority = (r.priority || '').trim();
    request.request.duedate = (r.duedate || '').trim();
    request.request.justification = (r.justification || '').trim();

    return request;
  } catch {

    throw 'Unable to parse the data sent by you'
  }
}

const validate_request = (request) => {
  if (!request.user.email) {
    return { email: 'The requester email is required to create the ticket' };
  }

  const data = request.request;

  const errors = {};
  const summary = data.summary;
  if (summary.length < 10) {
    errors.summary = 'The summary is required, length should be greater or equal to 10';
  }

  const description = data.description;
  if (description.length < 10 || description.length > 3000) {
    errors.description = 'The description is required, length should be between 10 & 3000';
  }

  let options = ['Bug', 'Support', 'Feature'];
  const request_type = data.request_type;
  if (options.indexOf(request_type) < 0) {
    errors.request_type = 'The request_type is required - Bug | Support | Feature';
  }

  options = ['Accounting', 'Admin', 'CRM', 'DMAP', 'N/A'];
  const affected_application = data.affected_application;
  if (options.indexOf(affected_application) < 0) {
    errors.affected_application = 'The affected_application is required - Accounting | Admin | CRM | DMAP | N/A';
  }

  options = ['NORMAL', 'CRITICAL'];
  const priority = data.priority;
  if (options.indexOf(priority) < 0) {
    errors.priority = 'The priority is required - NORMAL | CRITICAL';
  }

  const duedate = data.duedate;
  if (duedate) {
    let date_valid = true;
    const date = Date.parse(duedate);

    if (! date) {
      errors.duedate = 'The duedate is not valid';
      date_valid = false;
    }

    if (date_valid) {
      const t = new Date();
      t.setHours(t.getHours() - 5);
      const time_string = `${t.getMonth() + 1}/${t.getDate()}/${t.getFullYear()}`;
      const time_stamp = Date.parse(time_string);

      console.log(`Input time: ${duedate} - Begin of the day: ${time_string}`);
      console.log(`Input time: ${date} - Begin of the day: ${time_stamp}`);

      if (Math.floor(date) < Math.floor(time_stamp)) {
        errors.duedate = 'The duedate need to be in the future';
        date_valid = false;
      }
    }

    if (date_valid) {
      const today = new Date();
      const y = today.getFullYear();
      const m = today.getMonth();
      const d = today.getDate();
      const ten_year = new Date(y + 10, m, d);

      if (date > ten_year) {
        errors.duedate = 'The duedate is more than 10 years away?';
        date_valid = false;
      }
    }

    if (date_valid) {
      const justification = data.justification;
      if (justification.length < 10 || justification.length > 3000) {
        errors.justification = 'The justification is required if duedate is givn, length should be between 10 & 3000';
      }
    }
  }

  return Object.keys(errors).length > 0? errors: null;
};

const create = async (body) => {
  let request = null;
  try {
    request = parse_body(body);
  } catch (ex) {
    return HTTPResponse.BadRequest(JSON.stringify({message: ex}));
  }

  const vError = validate_request(request);
  if(vError) {
    return HTTPResponse.BadRequest(JSON.stringify({message: vError}));
  }

  try {

    const email = request.user.email;
    const jira_account = await get_jira_accountId_by_email(email);
    if (jira_account.error) {
      throw jira_account.error;
    }

    request.request.jira_accountId = jira_account.user.jira_accountId;
  } catch (ex) {
    return HTTPResponse.InternalServerError(JSON.stringify(ex))
  }

  let data = null;
  try {
    data = jira_mapper.map(request);
  } catch {
    return HTTPResponse.BadRequest(JSON.stringify({message: 'Failed to interpret the request'}));
  }

  let key = null;
  try {
    const result = await jira_create_ticket.create(data);
    key = result.data.key;

    if (! key) {
      throw 'Ticket key is not received from Jira'
    }
  } catch (ex) {
    return HTTPResponse.InternalServerError(JSON.stringify({message: ex}))
  }
  
  return HTTPResponse.OK(JSON.stringify({key: key}));
};

exports.create = create;