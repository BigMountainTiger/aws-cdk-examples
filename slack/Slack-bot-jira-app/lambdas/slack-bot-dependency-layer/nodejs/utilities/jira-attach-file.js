const ext_axios = require('../common/ext-axios');

const JIRA_AUTH_EMAIL = process.env.JIRA_AUTH_EMAIL;
const JIRA_AUTH_TOKEN = process.env.JIRA_AUTH_TOKEN;
const JIRA_ATTACHMENT_URL = process.env.JIRA_ATTACHMENT_URL;

const attach = async (data) => {
  const { key, form } = data;
  
  const jira_url = JIRA_ATTACHMENT_URL.replace('${jiraId}', key);
    const options = {
      method: 'POST',
      headers: {
        'X-Atlassian-Token': 'nocheck',
        'content-type': `multipart/form-data; boundary=${form._boundary}`
      },
      auth: { username: JIRA_AUTH_EMAIL, password: JIRA_AUTH_TOKEN },
      data: form,
      url: jira_url,
    };
    
    return await ext_axios(options, 40);
};

exports.attach = attach;