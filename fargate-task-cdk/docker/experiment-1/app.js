const AWS = require('aws-sdk');

const argv = process.argv;
const delay = 1;

const bucket = 'logs.huge.head.li';

// This is not needed when running on AWS
// AWS.config.update(
//   {
//       accessKeyId: '',
//       secretAccessKey: '',
//       region: 'us-east-1'
//   }
// );

const put_s3_object = async () => {
  const s3 = new AWS.S3();
  
  const time = new Date().toISOString();
  const TARGET_KEY = time.replace(/:/g, '-').replace(/\./g, '-');

  const params = {
    Bucket: bucket,
    Key: TARGET_KEY,
    Body: time
  };

  const result = await s3.putObject(params).promise(); 
  return result;
};


(async () => {

  const r = await new Promise((rs, rj) => {
    setTimeout(async () => {

      try {
        await put_s3_object();
      } catch(ex) {
        console.log(ex);
      }

      rs(argv);
    }, delay * 1000);
  });

  console.log(r[2]);
  console.log('End.')
})();

console.log('Started ...');