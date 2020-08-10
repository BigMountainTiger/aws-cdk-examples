const jiraMapper = require('/opt/nodejs/utilities/jira-mapper');
const get_jira_accountId_by_slack_id = require('/opt/nodejs/utilities/get-jira-accountId-by-slack-id');
const jira_create_ticket = require('/opt/nodejs/utilities/jira_create_ticket');

const BOT_APP_NAME = process.env.BOT_APP_NAME;

const create = async (request) => {

  try {
    const res = await get_jira_accountId_by_slack_id(request.user.id);
    if (res.error) {
      return res.error.message;
    }
    
    const jira_accountId = res.user.jira_accountId;
    if (!jira_accountId) {
      return 'Unable to get the issue requester\'s jira information';
    }

    request.request.jira_accountId = jira_accountId;

  } catch(e) {
    return 'Unable to get the issue requester\'s jira information - @' + (new Date()).toLocaleString();
  }

  let data = {}
  try {
    data = jiraMapper.map(request);
  } catch(e) {
    return 'Unable to understand the issue request - @' + (new Date()).toLocaleString();
  }

  let msgText = '';
  try {
    const result = await jira_create_ticket.create(data);
    const key = result.data.key;
    const summary = request.request.summary;

    msgText = `*The issue created successfully @ ${(new Date()).toLocaleString()}*\n\n`
      + `*Issue Key:* ${key}\n`
      + `*Issue Summary:* ${summary}\n\n`
      + `To attach a file to the issue, upload the file to "*${BOT_APP_NAME}*" `
      + `and type the issue key ${key} (*Issue key only*) in the message when share the file.\n`;

  } catch(e) {
    const summary = request.request.summary;

    msgText = `*Unable to create issue:* ${summary}\n`
      + `@ ${(new Date()).toLocaleString()}\n\n`
      + `Please contact technical support.\n`;
  }

  return msgText;
};

exports.create = create;

