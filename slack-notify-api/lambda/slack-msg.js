require('dotenv').config();
const axios = require('axios');
const { WebClient } = require('@slack/web-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const SLACK_CHAT_POSTMESSAGE_URL = process.env.SLACK_CHAT_POSTMESSAGE_URL;

const send_msg = async (msg) => {

  const options = {
    method: 'post',
    url: SLACK_CHAT_POSTMESSAGE_URL,
    data: msg,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + BOT_TOKEN
    }
  };

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

  const slack_res = await ext_axios(options);
  if (!slack_res.data.ok) { 
    throw Error('Unable to send information to Slack');
  }

};

const send_msg_slack_web_client = async (msg) => {
  const client = new WebClient(BOT_TOKEN);
  await client.chat.postMessage(msg);
};

module.exports = async () => {

  const msgText = `*You can no longer submit support request here*\n\n`
      + `*To submit a request:*\n`
      + `Type in "*/techsupport*" (no quote) in slack and hit enter, a form will be displayed.\n`
      + `You can submit the request through the form.`;

  const msg = {
    channel: 'U0101CPEW5U',
    text: msgText
  };

  try {

    //await send_msg(msg);
    await send_msg_slack_web_client(msg);
    console.log('MSG sent\n' + JSON.stringify(msg));

  } catch(e) {
    console.error('Unable to send the message to slack\n' + JSON.stringify(msg));
  }

};
