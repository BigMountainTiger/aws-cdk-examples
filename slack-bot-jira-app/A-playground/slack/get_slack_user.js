require('dotenv').config({ path: __dirname + '/../.env' });

const ext_axios = require('../common/ext-axios');

const BOT_TOKEN = process.env.BOT_TOKEN;

const get_slack_user = async () => {
  const url = `https://slack.com/api/users.info?user=${escape('U01023BN1MX')}`;

  const options = {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + BOT_TOKEN },
    url: url,
  };

  const res = await ext_axios(options, 3);
  return res.data;

};

(async () => {
  
  const data = await get_slack_user();
  console.log(data.user.profile.email);

})();

console.log('Initiated ...');