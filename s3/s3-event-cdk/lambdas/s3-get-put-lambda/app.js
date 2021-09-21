// S3GETPUTLAMBDAF0460A43
const AWS = require('aws-sdk');

const bucket = 's3-event-bucket.huge.head.li';
const SOURCE_KEY = 'aaca9175-dda1-4eae-b462-1315b2883b07';
const TARGET_KEY = 'AnotherFolder/ThisIsFine';

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
  
  const file = await get_object();
  const text = file.Body.toString();

  const result = await put_object(text);
  console.log(result);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify(result)
  };
};
