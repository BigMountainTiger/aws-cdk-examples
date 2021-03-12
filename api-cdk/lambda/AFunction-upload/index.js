const AWS = require('aws-sdk');
const parser = require('lambda-multipart-parser');

const put_s3_object = async (buffer) => {
  const s3 = new AWS.S3();
  
  const bucket = 'api-cdk.huge.head.li';

  const time = new Date().toISOString();
  const TARGET_KEY = time.replace(/:/g, '-').replace(/\./g, '-');

  const params = {
    Bucket: bucket,
    Key: `${TARGET_KEY}.jpg`,
    Body: buffer
  };

  const result = await s3.putObject(params).promise(); 
  return result;
};

exports.handler = async (event, context) => {

  const content_type = event.headers['Content-Type'];
  const boundary = `--${content_type.split('boundary=')[1]}`;
  const body = event.body;
  
  const parse_result = await parser.parse(event);
  const file = parse_result.files[0];

  console.log(file);

  const data = file.content;


  const result = await put_s3_object(data);
  
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" },
    body: JSON.stringify(result)
  };
  
};