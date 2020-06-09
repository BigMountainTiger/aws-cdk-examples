// https://medium.com/@aakashbanerjee/upload-files-to-amazon-s3-from-the-browser-using-pre-signed-urls-4602a9a90eb5
// https://medium.com/@aidan.hallett/securing-aws-s3-uploads-using-presigned-urls-aa821c13ae8d
// Get presigned url.

// S3PRESIGNEDURLLAMBDA9E1C8D88

require('dotenv').config();
const AWS = require('aws-sdk');

const credentials = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY
};

AWS.config.update({ credentials: credentials, region: 'us-east-1' });

const getUrl = () => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: 's3-event-bucket.huge.head.li', 
    Key: 'key-1.txt', 
    Expires: 60 * 2
  };

  const p = new Promise((rs, rj) => {
    s3.getSignedUrlPromise('putObject', params, (err, url) => {
      if (err) { rj(err); } else { rs(url); }
    });
  });
  
  return p;
}

exports.lambdaHandler = async (event, context) => {
  
  const url = await getUrl();
  console.log(url);

  return {
    url: url
  };
};
