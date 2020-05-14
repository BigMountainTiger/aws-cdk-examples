const BOT_TOKEN = process.env.BOT_TOKEN;
const SLACK_CHAT_POSTMESSAGE_URL = process.env.SLACK_CHAT_POSTMESSAGE_URL;

const axios = require('axios');
const CancelToken = axios.CancelToken;

const inform = async (msg) => {

  let source = CancelToken.source();
  setTimeout(() => { source.cancel(); }, 3 * 1000);

  const options = {
    method: 'post',
    cancelToken: source.token,
    url: SLACK_CHAT_POSTMESSAGE_URL,
    data: msg,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + BOT_TOKEN
    }
  };

  const slack_res = await axios(options);
  if (!slack_res.data.ok) { throw Error('Unable to send information to Slack') }
};

exports.inform = inform;

