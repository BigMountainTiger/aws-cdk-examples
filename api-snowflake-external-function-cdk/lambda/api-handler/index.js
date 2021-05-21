require('dotenv').config();
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const SLACK_CHAT_POSTMESSAGE_URL = process.env.SLACK_CHAT_POSTMESSAGE_URL;
const SONG_ID = 'U0101CPEW5U';

const ext_axios = async (options, timeout_second) => {
  const timeout_second_default = 5;
  const timeout = (timeout_second || timeout_second_default) * 1000;
  const CancelToken = axios.CancelToken;

  const source = CancelToken.source();
  const tm = setTimeout(() => { source.cancel(`Cancelled after ${timeout}ms.`); }, timeout);

  options.cancelToken = source.token;

  try {
    return await axios(options);
  } finally { clearTimeout(tm); }
};

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

  const res = await ext_axios(options);
  if (!res.data.ok) { 
    throw Error('Unable to send information to Slack');
  }
};

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body || '{}');

  inform({
    channel: SONG_ID,
    text: 'This is a test'
  });

  return {
    statusCode: 200,
    body: JSON.stringify('OK')
  };
};