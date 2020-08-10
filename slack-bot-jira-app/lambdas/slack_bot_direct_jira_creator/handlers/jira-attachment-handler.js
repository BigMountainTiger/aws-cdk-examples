const HTTPResponse = require('../HTTPResponse');
const jira_attach_file = require('/opt/nodejs/utilities/jira-attach-file');

const FormData = require('form-data');

const validate_request = (request) => {
  const errors = {};
  
  const key = (request.key || '').trim();
  const file = request.file || {};
  const name = (file.name || '').trim();
  const body = (file.body || '')

  if (!key) {
    errors.key = 'The Jira issue key is required';
  }

  if (!name) {
    errors.name = 'The attached file name is required';
  }

  if (body.length === 0) {
    errors.body = 'You need to post the file (BASE64) to attach to the ticket';
  }

  return Object.keys(errors).length > 0? errors: null;
};

const attach = async (request) => {
  const vError = validate_request(request);
  if(vError) {
    return HTTPResponse.BadRequest(JSON.stringify({message: vError}));
  }

  const { key, file } = request;
  const { name, body } = file;

  const form = new FormData();
  const buff = Buffer.from(body, 'base64');
  form.append('file', buff, name);

  try {
    let jira_res = await jira_attach_file.attach({key: key, form: form});
  } catch(ex) {
    
    console.log(ex);
    return HTTPResponse.BadRequest(`Failed to attach the file. The "${key}" is a valid key?`)
  }

  return HTTPResponse.OK(JSON.stringify({key: key, name: name, size: buff.length}));
};

exports.attach = attach;