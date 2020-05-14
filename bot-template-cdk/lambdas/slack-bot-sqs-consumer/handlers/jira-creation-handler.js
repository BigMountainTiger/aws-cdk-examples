const axios = require('axios');
const CancelToken = axios.CancelToken;
const jiraMapper = require('./jira-mapper');
const get_jira_accountId_by_slack_id = require('../utilities/get-jira-accountId-by-slack-id');

const BOT_APP_NAME = process.env.BOT_APP_NAME;
const JIRA_CREATE_URL = process.env.JIRA_CREATE_URL;
const JIRA_AUTH_EMAIL = process.env.JIRA_AUTH_EMAIL;
const JIRA_AUTH_TOKEN = process.env.JIRA_AUTH_TOKEN;

const mappData = (request) => {
  const m = jiraMapper.createMapper(request);

  const data = {

    fields: {
      project: { key: m.projectKey() },
      summary: m.summary(),
      description: m.description(),
      reporter: {
        accountId: m.reporterId()
      },
      assignee: {
        accountId: m.assigneeId()
      },
      duedate: m.duedate(),
      labels: m.labels(),
      priority: {
        name: m.priorityName()
      },
      issuetype: { name: m.issuetypeName() }
    }
  };

  return data;
}

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
    data = mappData(request);
  } catch(e) {
    return 'Unable to understand the issue request - @' + (new Date()).toLocaleString();
  }
  
  let source = CancelToken.source();
  setTimeout(() => { source.cancel(); }, 3 * 1000);

  const options = {
    method: 'POST',
    cancelToken: source.token,
    headers: {
      'X-Atlassian-Token': 'nocheck',
      'content-type': 'application/json'
    },
    auth: { username: JIRA_AUTH_EMAIL, password: JIRA_AUTH_TOKEN },
    data: data,
    url: JIRA_CREATE_URL,
  };

  let msgText = '';
  try {
    const result = await axios(options);
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

