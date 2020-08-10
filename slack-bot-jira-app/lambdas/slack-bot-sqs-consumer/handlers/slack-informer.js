const BOT_TOKEN = process.env.BOT_TOKEN;
const SLACK_CHAT_POSTMESSAGE_URL = process.env.SLACK_CHAT_POSTMESSAGE_URL;

const ext_axios = require('/opt/nodejs/common/ext-axios');

const inform = async (msg) => {

  const options = {
    method: 'post',
    url: SLACK_CHAT_POSTMESSAGE_URL,
    data: msg,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + BOT_TOKEN
    }
  };

  const slack_res = await ext_axios(options);
  if (!slack_res.data.ok) { throw Error('Unable to send information to Slack') }
};

exports.inform = inform;

