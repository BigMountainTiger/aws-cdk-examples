const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  console.log(event);

  await new Promise((rs, rj) => {
  
    (new AWS.CloudWatchLogs()).putRetentionPolicy({
      logGroupName: '/aws/lambda/ALayeredFunction',
      retentionInDays: 1
    }, (e, d) => { if (e) { rj(e); } else { rs(d); } });
  });
  
  return { statusCode: 200 };
};