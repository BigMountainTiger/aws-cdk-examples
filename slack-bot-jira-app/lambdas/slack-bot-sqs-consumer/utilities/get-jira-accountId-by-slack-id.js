const ext_axios = require('/opt/nodejs/common/ext-axios');
const email_validator = require('/opt/nodejs/common/email-validator');

const BOT_TOKEN = process.env.BOT_TOKEN;
const SLACK_GET_USER_URL = process.env.SLACK_GET_USER_URL;

const JIRA_AUTH_EMAIL = process.env.JIRA_AUTH_EMAIL;
const JIRA_AUTH_TOKEN = process.env.JIRA_AUTH_TOKEN;
const JIRA_GET_USER_URL = process.env.JIRA_GET_USER_URL;
const JIRA_CREATE_CUSTOMER_URL = process.env.JIRA_CREATE_CUSTOMER_URL;

const get_slack_user = async (slackId) => {
  const url = SLACK_GET_USER_URL.replace('${slack-id}', escape(slackId));

  const options = {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + BOT_TOKEN },
    url: url,
  };

  return await ext_axios(options);
};

const get_jira_user = async (email) => {
  const url = JIRA_GET_USER_URL.replace('${email-address}', escape(email));

  const options = {
    method: 'GET',
    auth: { username: JIRA_AUTH_EMAIL, password: JIRA_AUTH_TOKEN },
    url: url,
  };

  return await ext_axios(options);
};

const create_jira_user = async (email) => {
  const url = JIRA_CREATE_CUSTOMER_URL;

  const data = { email: email, displayName: email.split('@')[0] };
  const options = {
    method: 'POST',
    auth: { username: JIRA_AUTH_EMAIL, password: JIRA_AUTH_TOKEN },
    url: url,
    data: data
  };

  return await ext_axios(options);
};

const get_jira_accountId_by_slack_id = async (slackId) => {
  const result = { user: {}, error: null };

  try {
    const res = await get_slack_user(slackId);
    const email = (res.data.user.profile.email || '').trim().toLowerCase() || null;

    if (! email) {
      result.error = {
        message: 'Slack is unable to get the user information'
      };
      return result;
    }

    result.user.email = email;

  } catch(e) {

    result.error = {
      error: e,
      message: 'Unable to communicate to slack to get the user information'
    };
    return result;
  }

  const email = result.user.email;

  if (!email_validator.validate_email(email)) {
    result.error = {
      message: `Your slack email ${email} is not a valid email address`
    };
    return result;
  }

  if (!email_validator.validate_domain(email)) {
    result.error = {
      message: `Your slack email ${email} is not supported - supported domains are ${email_validator.TOP_DOMAINS}`
    };
    return result;
  }

  try {
    const res = await get_jira_user(email);

    const data = res.data;
    if(!Array.isArray(data)) {
      result.error = {
        message: 'Jira is unable to respond any user information'
      };
      return result;
    }

    const length = data.length;
    if (length > 0) {

      if (length > 1) {
        result.error = {
          message: `Jira found multiple users to match ${email}`
        };
        return result;
      }

      const jira_user = data[0];
      const jira_accountId = jira_user.accountId;

      result.user.jira_accountId = jira_accountId;
      result.user.information = 'Found';
      return result;
    }
    
  } catch(e) {

    result.error = {
      error: e,
      message: 'Unable to communicate to Jira to get the user information'
    };
    return result;
  }

  try {
    const res = await create_jira_user(email);
    const jira_user = res.data;
    const jira_accountId = jira_user.accountId;
    
    if (!jira_accountId) {
      result.error = {
        message: 'Jira is unable to respond the information for the user to be added'
      };
      return result;
    }

    result.user.jira_accountId = jira_accountId;
    result.user.information = 'Added';
  } catch(e) {

    result.error = {
      error: e,
      message: 'Unable to communicate to Jira to add the customer'
    };
    return result;
  }
  
  return result;
};

module.exports = get_jira_accountId_by_slack_id;
