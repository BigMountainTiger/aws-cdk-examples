// https://community.atlassian.com/t5/Jira-Service-Desk-questions/API-responses-suddenly-missing-emailAddress-field/qaq-p/1125871

// The missing field(s) are by design; it's not a bug but a choice made to comply with GDPR.
// Individual users can choose to disclose their email through the API but this means some will and some wont.
// A new API will be added in the future where you can get a list of all e-mails,
// however this requires whitelisting of your application.
// If this change breaks your code, then the only solution is to change the logic OR use the new API (when its available)
// OR have all your users disclose their email. For more information, see the links in the official answer below.

// https://community.atlassian.com/t5/Answers-Developer-Questions/Create-New-Users-using-JIRA-REST-API/qaq-p/541525

require('dotenv').config({ path: __dirname + '/../.env' });

const ext_axios = require('../common/ext-axios');

const JIRA_AUTH_EMAIL = process.env.JIRA_AUTH_EMAIL;
const JIRA_AUTH_TOKEN = process.env.JIRA_AUTH_TOKEN;

const get_jira_user = async (email) => {
  const url = `https://mlg-playground.atlassian.net/rest/api/2/user/search?query=${escape(email)}`;

  const options = {
    method: 'GET',
    auth: { username: JIRA_AUTH_EMAIL, password: JIRA_AUTH_TOKEN },
    url: url,
  };

  let res; 
  try {
    res = await ext_axios(options);
  } catch(e) {
    console.log(e.response.data);
  }
  

  return res.data;
};

(async () => {

  // .com
  // .org
  // .net
  // .int
  // .edu
  // .gov
  // .mil
  const data = await get_jira_user('da_tou_li@yahoo.com');

  //const data = await get_jira_user('song@monsterlg.com');
  //const data = await get_jira_user('andre@monsterlg.com');
  //const data = await get_jira_user('ashley@monsterlg.com');
  
  console.log(data);
  console.log(data.length);

})();

console.log('Initiated ...');