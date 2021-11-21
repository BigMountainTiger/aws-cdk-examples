const AWS = require('aws-sdk');

const bucket = 'api-cdk.huge.head.li';
const SOURCE_KEY = 'nice.jpg';

exports.handler = async (event, context) => {

  const get_object = async () => {
    const s3 = new AWS.S3();
  
    const params = {
      Bucket: bucket,
      Key: SOURCE_KEY
    };
  
    const file = await s3.getObject(params).promise();
  
    return file;
  };

  const get_presigned_Url = async () => {
    const s3 = new AWS.S3();
    const params = { Bucket: bucket, Key: SOURCE_KEY, Expires: 60 * 2 };
  
    return new Promise((rs, rj) => {
      s3.getSignedUrl('getObject', params, (err, url) => { if (err) { rj(err); } else { rs(url); } });
    });
    
  }

  const file = await get_object();
  let url = await get_presigned_Url();
  
  console.log(url);

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" },
    body: JSON.stringify({
      url: url
    })
  };
  
};