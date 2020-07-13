var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

exports.lambdaHandler = async (event, context) => {
  
  const s3 = event.Records[0].s3;

  console.log(s3);
  
  const aws_s3 = new AWS.S3();
  

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify({
      message: 'OK'
    })
  };

};