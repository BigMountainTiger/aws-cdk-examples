const AWS = require('aws-sdk');
AWS.config.update({region: process.env.SUPPORT_QUEUE_REGION});

const sendData = async (data) => {
  let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

  let params = {
    DelaySeconds: 0,
    MessageAttributes: {
      "Type": { DataType: "String", StringValue: "TECH_SUPPORT_REQUEST" }
    },
    MessageBody: JSON.stringify(data),
    QueueUrl: process.env.SUPPORT_QUEUE_URL
  };

  let request = new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) { reject(err); } else { resolve(data.MessageId) }
    });
  });

  await request;
};

exports.sendData = sendData;