const ext_axios = require('../common/ext-axios');

const JIRA_CREATE_URL = process.env.JIRA_CREATE_URL;
const JIRA_AUTH_EMAIL = process.env.JIRA_AUTH_EMAIL;
const JIRA_AUTH_TOKEN = process.env.JIRA_AUTH_TOKEN;

const create = async (data) => {
  const options = {
    method: 'POST',
    headers: {
      'X-Atlassian-Token': 'nocheck',
      'content-type': 'application/json'
    },
    auth: { username: JIRA_AUTH_EMAIL, password: JIRA_AUTH_TOKEN },
    data: data,
    url: JIRA_CREATE_URL,
  };
  
  const result = await ext_axios(options);
  return result;
};

exports.create = create;
