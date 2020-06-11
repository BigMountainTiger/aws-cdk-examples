const AWS = require('aws-sdk');

const bucket = 'sfn-parallel-test-bucket.huge.head.li';

const put_object = async (TARGET_KEY, buffer) => {

  const s3 = new AWS.S3();
  const params = {
    Bucket: bucket,
    Key: TARGET_KEY,
    Body: buffer,
    ContentType: "text/html"
  };

  const result = await s3.putObject(params).promise(); 
  return result;
};

exports.lambdaHandler = async (event, context) => {

  console.log(event);

  const TARGET_KEY = (new Date().toISOString()).replace(/:/g, '-').replace(/\./g, '-');
  const buffer = Buffer.from(JSON.stringify(event), 'utf8');

  const result = await put_object(TARGET_KEY, buffer);

  return result;
};