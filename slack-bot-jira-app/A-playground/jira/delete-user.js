require('dotenv').config({ path: __dirname + '/../.env' });

const ext_axios = require('../common/ext-axios');

const JIRA_AUTH_EMAIL = process.env.JIRA_AUTH_EMAIL;
const JIRA_AUTH_TOKEN = process.env.JIRA_AUTH_TOKEN;

const delete_jira_user = async (accoundId) => {
  const url = `https://mlg-playground.atlassian.net/rest/api/2/user?accountId=${accoundId}`;
  //const url = `https://mlg-playground.atlassian.net/rest/servicedeskapi/customer`;

  const accountIds = [accoundId];
  const data = {
    accountIds: accountIds
  };

  const options = {
    method: 'DELETE',
    auth: { username: JIRA_AUTH_EMAIL, password: JIRA_AUTH_TOKEN },
    headers: {
      'X-ExperimentalApi': 'opt-in'
    },
    url: url,
    data: data
  };

  try {
    let res = await ext_axios(options);
    return res;
  } catch(e) {
    //console.log(e);
    console.log(e.response.data);
  }
  
};

(async () => {

  const data = await delete_jira_user('qm:3a7d83b8-6121-48cc-b7a0-876120c59bb9:a379b892-f67e-457a-b40b-2c72120ca119');
  console.log(data);

})();

console.log('Initiated ...');