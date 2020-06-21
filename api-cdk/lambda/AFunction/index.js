// Need base64 
// https://stackoverflow.com/questions/6978156/get-base64-encode-file-data-from-input-form
// https://stackoverflow.com/questions/3717793/javascript-file-upload-size-validation
// https://stackoverflow.com/questions/46358922/request-payload-limit-with-aws-api-gateway
// https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/

const AWS = require('aws-sdk');

const bucket = 'logs.huge.head.li';

const put_s3_object = async (buffer) => {
  const s3 = new AWS.S3();
  
  const time = new Date().toISOString();
  const TARGET_KEY = time.replace(/:/g, '-').replace(/\./g, '-');

  const params = {
    Bucket: bucket,
    Key: TARGET_KEY,
    Body: buffer
  };

  const result = await s3.putObject(params).promise(); 
  return result;
};

exports.handler = async (event, context) => {
  const body = event.body;
  const buff = Buffer.from(body, 'base64'); 

  await put_s3_object(buff);

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" },
    body: 'OK'
  };
};