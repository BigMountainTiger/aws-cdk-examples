const AWS = require('aws-sdk');

const bucket = 'sfn-parallel-test-bucket.huge.head.li';

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
  
  // await new Promise((rs, rj) => {

  //   const timeout = 10 * 1000;
  //   setTimeout(() => {
  //     rs(`Waited for ${timeout} seconds`);
  //   }, timeout);
  // });

  // const time = new Date().toISOString();
  // return {
  //   Payload: { time: time }
  // };

  const time = new Date().toISOString();
  const result = await put_object(time);

  return {
    Payload: result
  };
};