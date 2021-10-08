const ext_axios = require('../common/ext-axios');
const get_jira_accountId_by_email = require('./get-jira-accountId-by-email');

const BOT_TOKEN = process.env.BOT_TOKEN;
const SLACK_GET_USER_URL = process.env.SLACK_GET_USER_URL;

const get_slack_user = async (slackId) => {
  const url = SLACK_GET_USER_URL.replace('${slack-id}', escape(slackId));

  const options = {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + BOT_TOKEN },
    url: url,
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

  try {
    return await get_jira_accountId_by_email(email);
  } catch(e) {

    result.error = {
      error: e,
      message: 'Unable to communicate to Jira to get the user ID'
    };
    return result;
  }
};

module.exports = get_jira_accountId_by_slack_id;
