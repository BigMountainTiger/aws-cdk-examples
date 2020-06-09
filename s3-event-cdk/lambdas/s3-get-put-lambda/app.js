// S3GETPUTLAMBDAF0460A43
const AWS = require('aws-sdk');

exports.lambdaHandler = async (event, context) => {
  

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify('Success')
  };
};
