const AWS = require('aws-sdk');

const bucket = 'step-test-bucket.huge.head.li';

const put_object = async (time) => {
  const s3 = new AWS.S3();
  
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
  
  const time = event.Payload.time;
  result = await put_object(time);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify(result)
  };
};