const AWS = require('aws-sdk');
const parser = require('lambda-multipart-parser');

const s3 = new AWS.S3();
const bucket = 'api-cdk.huge.head.li';

const put_s3_object = async (buffer) => {

  const time = new Date().toISOString();
  const TARGET_KEY = time.replace(/:/g, '-').replace(/\./g, '-');

  const params = {
    Bucket: bucket,
    Key: `${TARGET_KEY}.jpg`,
    Body: buffer
  };

  await s3.putObject(params).promise();

  const get_presigned_Url = async () => {
    const params = { Bucket: bucket, Key: `${TARGET_KEY}.jpg`, Expires: 60 * 60 * 24 };
  
    return new Promise((rs, rj) => {
      s3.getSignedUrl('getObject', params, (err, url) => { if (err) { rj(err); } else { rs(url); } });
    });
  };

  const result =  await get_presigned_Url();
  return result;
};

// Need to deploy to aws to use multipart upload
// SAM local won't work for now
exports.handler = async (event, context) => {
  
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