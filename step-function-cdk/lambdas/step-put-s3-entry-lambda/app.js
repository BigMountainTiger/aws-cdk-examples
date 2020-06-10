const AWS = require('aws-sdk');

const bucket = 'step-test-bucket.huge.head.li';

const put_object = async () => {
  const s3 = new AWS.S3();
  
  const time = new Date().toISOString();
  const TARGET_KEY = time.replace(/:/g, '-').replace(/\./g, '-');
  const buffer = Buffer.from(time, 'utf8');

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
  
  let result = {};
  
  const time = new Date().toISOString();
  const key = time.replace(/:/g, '-').replace(/\./g, '-');

  result = await put_object();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify(result)
  };
};