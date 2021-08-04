const AWS = require('aws-sdk');

exports.handler = async (event, context) => {

  // throw 'This is bullshit';

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify('OK')
  };
  
};