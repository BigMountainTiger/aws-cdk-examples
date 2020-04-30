const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  console.log(event);
  const logGroupName = ((event.detail || {}).requestParameters || {}).logGroupName;
  if (! logGroupName) { return { statusCode: 404 }; }
 
  await new Promise((rs, rj) => {

    (new AWS.CloudWatchLogs()).putRetentionPolicy({ logGroupName: logGroupName, retentionInDays: 1 },
      (e, d) => { if (e) { rj(e); } else { rs(d); } });
  });
  
  return { statusCode: 200 };
};