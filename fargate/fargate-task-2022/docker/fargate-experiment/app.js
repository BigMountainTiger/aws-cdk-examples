// It is possible to pass parameter into docker
// const argv = process.argv;
// console.log(argv)

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const bucket = 'test.bucket.huge.head.li';
const time = new Date().toISOString();
const TARGET_KEY = `B-${time.replace(/:/g, '-').replace(/\./g, '-')}`;

let logger = null;

const create_logger = async () => {
  const group = 'FARGATE-TASK-2022';

  var cw = new AWS.CloudWatchLogs();
  await cw.createLogStream({ logGroupName: group, logStreamName: TARGET_KEY }).promise();

  let sequenceToken = null;
  return {
    log: async (msg) => {

      console.log(msg);
      const event = {
        logGroupName: group,
        logStreamName: TARGET_KEY,
        logEvents: [
          {
            message: msg,
            timestamp: Math.floor(Date.now())
          }
        ],
        sequenceToken: sequenceToken
      };

      const response = await cw.putLogEvents(event).promise();
      sequenceToken = response.nextSequenceToken;
    }
  };

};

const clear_bucket = async () => {
  const s3 = new AWS.S3();

  const files = await s3.listObjectsV2({ Bucket: bucket }).promise();

  for (const file of files.Contents) {
    await s3.deleteObject({ Bucket: bucket, Key: file.Key }).promise();
    await logger.log(`Deleted ${file.Key}`);
  }
};

const put_s3_object = async () => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: bucket,
    Key: TARGET_KEY,
    Body: `Generated ${TARGET_KEY}`
  };

  const result = await s3.putObject(params).promise();
  return result;
};

(async () => {

  logger = await create_logger();

  try {
    await logger.log('Started ...');
    await clear_bucket();
    const result = await put_s3_object();

    await logger.log(JSON.stringify(result));
    await logger.log('End')

  } catch (ex) {
    await logger.log(JSON.stringify(ex));
  }

})();