require('dotenv').config();

const axios = require('axios');
const CancelToken = axios.CancelToken;

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.SUPPORT_QUEUE_REGION});

const SUPPORT_QUEUE_URL = process.env.SUPPORT_QUEUE_URL;
const BOT_TOKEN = process.env.BOT_TOKEN;

const JIRA_AUTH_EMAIL = process.env.JIRA_AUTH_EMAIL;
const JIRA_AUTH_TOKEN = process.env.JIRA_AUTH_TOKEN;

const getCancelToken = (seconds) => {
  let source = CancelToken.source();
  setTimeout(() => { source.cancel('Timeout'); }, seconds * 1000);

  return source.token;
};

const validate_slack = async () => {
  const url = 'https://slack.com/api/auth.test';

  const options = {
    method: 'GET',
    cancelToken: getCancelToken(3),
    headers: { Authorization: 'Bearer ' + BOT_TOKEN },
    url: url,
  };

  try {
    const res = await axios(options);
    return res.data
  } catch(e) {
    return {
      FAIL: 'SLACK VALIDATION FAILED',
      error: e
    };
  }
};

const validate_sqs = async () => {
  const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
  
  const params = {
    QueueUrl: SUPPORT_QUEUE_URL,
    AttributeNames: [ 'ApproximateNumberOfMessages',
      'VisibilityTimeout',
      'ReceiveMessageWaitTimeSeconds'
    ]
  }

  const p = new Promise((rs, rj) => {
    sqs.getQueueAttributes(params, function(e, d) {
      if (e) rj(e);
      else rs(d);
    });
  });

  try {
    return await p;
  } catch(e) {
    return {
      FAIL: 'SQS VALIDATION FAILED',
      error: e
    };
  }
};

const validate_jira = async () => {
  const url_template = 'https://mlg-playground.atlassian.net/rest/api/2/user/search?query={user-email}';
  const url = url_template.replace('{user-email}', JIRA_AUTH_EMAIL);

  const options = {
    method: 'GET',
    cancelToken: getCancelToken(3),
    auth: { username: JIRA_AUTH_EMAIL, password: JIRA_AUTH_TOKEN },
    url: url,
  };

  try {
    const res = await axios(options);
    const data = res.data[0];
    delete data.avatarUrls;

    return data;
  } catch(e) {
    return {
      FAIL: 'JIRA VALIDATION FAILED',
      error: e
    };
  }
};

const validate = async () => {
  const slack_data = await validate_slack();
  const sqs_data = await validate_sqs();
  const jira_data = await validate_jira();

  return {
    slack_data: slack_data,
    sqs_data: sqs_data,
    jira_data: jira_data
  };

};

exports.validate = validate;