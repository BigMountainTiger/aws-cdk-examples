const axios = require('axios');
const dialog = require('../dialog_blocks/dialog');
const standardResponses = require('./standard-responses');

const launch = async (trigger_id) => {
  const token = process.env.BOT_TOKEN;
  let url = process.env.SLACK_DIALOG_URL;
  let data = {
    "trigger_id": trigger_id,
    "dialog": dialog()
  };

  const options = {
    method: 'post',
    url: url,
    data: data,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  }

  let statusText = '';
  try {
    let res = await axios(options);
    let d = res.data || {};
    if (! d.ok) {
      statusText = 'Slack refuses to open the dialog';
    }
  } catch (err) {
    statusText = 'Unable to connect to the server to open the dialog';
  }

  return standardResponses.INFORMATIONRESPONSE(statusText);
}

exports.launch = launch;
