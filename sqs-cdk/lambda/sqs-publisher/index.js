const SUPPORT_QUEUE_REGION = 'us-east-1';
const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/005256505030/ATestSQSQueue';

const AWS = require('aws-sdk');
AWS.config.update({region: SUPPORT_QUEUE_REGION});

exports.handler = async (event, context) => {
  
  let sqs = new AWS.SQS({apiVersion: '2012-11-05'});
  
  let params = {
    DelaySeconds: 0,
    MessageAttributes: { "Type": { DataType: "String", StringValue: "TEST" }},
    MessageBody: JSON.stringify('This is from the sqs message producer'),
    QueueUrl: QUEUE_URL
  };

  let request = new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) { reject(err); } else { resolve(data.MessageId) }
    });
  });

  let response = null;
  try {
    response = await request;
  } catch(e) {
    response = e;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: response
    })
  };
};