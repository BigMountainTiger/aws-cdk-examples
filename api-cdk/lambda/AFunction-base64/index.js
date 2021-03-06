// Need base64 
// https://stackoverflow.com/questions/6978156/get-base64-encode-file-data-from-input-form
// https://stackoverflow.com/questions/3717793/javascript-file-upload-size-validation
// https://stackoverflow.com/questions/46358922/request-payload-limit-with-aws-api-gateway
// https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/

const AWS = require('aws-sdk');

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
    const params = { Bucket: bucket, Key: `${TARGET_KEY}.jpg`, Expires: 60 * 2 };
  
    return new Promise((rs, rj) => {
      s3.getSignedUrl('getObject', params, (err, url) => { if (err) { rj(err); } else { rs(url); } });
    });
  };

  const result =  await get_presigned_Url();
  return result;
};

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  content = body.content;

  console.log(content);

  const buff = Buffer.from(content, 'base64');

  const presigned_url = await put_s3_object(buff);

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" },
    body: JSON.stringify(presigned_url)
  };
};