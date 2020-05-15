const axios = require('axios');
const CancelToken = axios.CancelToken;
const FormData = require('form-data');

const BOT_TOKEN = process.env.BOT_TOKEN;
const JIRA_AUTH_EMAIL = process.env.JIRA_AUTH_EMAIL;
const JIRA_AUTH_TOKEN = process.env.JIRA_AUTH_TOKEN;
const JIRA_ATTACHMENT_URL = process.env.JIRA_ATTACHMENT_URL;

const attachAFile = async (data) => {
  const jiraId = data.jiraId;
  const file = data.file;
  const fileName = file.name;

  let slack_res = null;
  try {
    let source = CancelToken.source();
    setTimeout(() => { source.cancel(); }, 15 * 1000);

    const slack_url = file.url_private;
    const options = {
      method: 'GET',
      cancelToken: source.token,
      headers: {
        Authorization: 'Bearer ' + BOT_TOKEN
      },
      responseType: 'stream',
      url: slack_url,
    };

    slack_res = await axios(options);

    // const content_length = slack_res.headers['content-length'];
    // if (!content_length) {
    //   return `Unable to attach *${fileName}*, Failed to download the file from slack, possibly permission denied.`;
    // }
  } catch(e) {
    return `Unable to attach *${fileName}*, Failed to download the file from slack`;
  }

  try {
    const form = new FormData();
    form.append('file', slack_res.data);

    let source = CancelToken.source();
    setTimeout(() => { source.cancel(); }, 30 * 1000);

    const jira_url = JIRA_ATTACHMENT_URL.replace('${jiraId}', jiraId);
    const options = {
      method: 'POST',
      cancelToken: source.token,
      headers: {
        'X-Atlassian-Token': 'nocheck',
        'content-type': `multipart/form-data; boundary=${form._boundary}`
      },
      auth: { username: JIRA_AUTH_EMAIL, password: JIRA_AUTH_TOKEN },
      data: form,
      url: jira_url,
    };
    
    let jira_res = await axios(options);
  } catch(e) {
    return `Unable to attach *${fileName}*, Check if the Jira Key exists or if the Jira issue *${jiraId}* may have been deleted or your file is too large`;
  }
  
  return `The file *${fileName}* has been attached`;
};

const attach = async (request) => {
  let jiraId = request.jiraId;
  if (! jiraId) {
    return `*Attachment is not added*\n`
      + 'Please type in the issue key (*Issue key only*) when sharing the file.\n';
  }

  jiraId = jiraId.trim();

  const files = request.files || [];
  const allStatus = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const status = await attachAFile( { jiraId: jiraId, file: file });

    allStatus.push(status);
  }

  let msg = `*File attachment status for* ${jiraId}\n\n`;
  for (let i = 0; i < allStatus.length; i++) {
    msg = msg + allStatus[i] + '\n';
  }

  return msg;
};

exports.attach = attach;