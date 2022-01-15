// It is possible to pass parameter into docker
// const argv = process.argv;
// console.log(argv)

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const time = new Date().toISOString();
const TARGET_KEY = `B-${time.replace(/:/g, '-').replace(/\./g, '-')}`;

let logger = null;

const create_logger = async () => {
  const group = 'EXPERIMENT-LOG-GROUP';

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

(async () => {
  const env = process.env;

  console.log(JSON.stringify(env, null, 4));

  logger = await create_logger();
  await logger.log(JSON.stringify(`A = ${env['A']}` || null, null, 4));
  await logger.log('Task Started ...');

})();