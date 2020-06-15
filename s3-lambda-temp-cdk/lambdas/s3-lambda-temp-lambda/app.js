// S3LAMBDATEMPLAMBDA853AB85C

const AWS = require('aws-sdk');
const fs = require('fs');

const bucket = 's3-lambda-temp-bucket.huge.head.li';
const SOURCE_KEY = 'Loan.txt';

const get_object = async () => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: bucket,
    Key: SOURCE_KEY
  };

  const file = await s3.getObject(params).promise();

  return file;
};

const put_object = async (text) => {
  const s3 = new AWS.S3();
  
  const time = new Date().toISOString();
  const TARGET_KEY = time.replace(/:/g, '-').replace(/\./g, '-');

  const buffer = Buffer.from(text, 'utf8');
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
  let result = {};

  const file = await get_object();
  const buffer = file.Body || new Buffer(0);

  console.log(buffer);

  // const result = await put_object(text);
  // console.log(result);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify(result)
  };
};
