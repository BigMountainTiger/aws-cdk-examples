require('dotenv').config({ path: __dirname + '/../.env' });

const axios = require('axios');
const CancelToken = axios.CancelToken;

const JIRA_AUTH_EMAIL = process.env.JIRA_AUTH_EMAIL;
const JIRA_AUTH_TOKEN = process.env.JIRA_AUTH_TOKEN;

const getCancelToken = (seconds) => {
  let source = CancelToken.source();
  setTimeout(() => { source.cancel('Timeout'); }, seconds * 1000);

  return source.token;
};

const get_jira_issue = async (key) => {
  const url = `https://mlg-playground.atlassian.net/rest/api/2/issue/${key}/`;

  const options = {
    method: 'GET',
    cancelToken: getCancelToken(3),
    auth: { username: JIRA_AUTH_EMAIL, password: JIRA_AUTH_TOKEN },
    url: url,
  };

  const res = await axios(options);
  return res.data;
};

(async () => {

  const data = await get_jira_issue('GSD-76');
  console.log(data);

})();

console.log('Initiated ...');