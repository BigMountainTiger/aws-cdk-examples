const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
AWS.config.update({region: 'us-east-1'});

const sendData = async (data) => {
  let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

  let params = {
    DelaySeconds: 0,
    MessageAttributes: {
      "Type": { DataType: "String", StringValue: "TECH_SUPPORT_REQUEST" }
    },
    MessageDeduplicationId: uuidv4(),
    MessageGroupId: 'TECH_SUPPORT_REQUEST_GROUP_ID',
    MessageBody: JSON.stringify(data),
    QueueUrl: `https://sqs.us-east-1.amazonaws.com/005256505030/SLACK_TECH_SUPPORT_QUEUE.fifo`
  };

  let request = new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) { reject(err); } else { resolve(data.MessageId) }
    });
  });

  await request;
};

(async () => {
  await sendData('Test data');
})();

console.log('Initiated ...');