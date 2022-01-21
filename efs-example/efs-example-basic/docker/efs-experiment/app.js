const fs = require('fs');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const create_logger = async () => {
  const group = 'EFS-FARGATE-TASK-LOG';

  const time = new Date().toISOString();
  const TARGET_KEY = `B-${time.replace(/:/g, '-').replace(/\./g, '-')}`;

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

  logger = await create_logger();

  const f = '/lambda/data.json';
  await logger.log(f);

  try {

    let data = null;
    if (fs.existsSync(f)) {

      await logger.log('Found');

      const f_data = fs.readFileSync(f, 'utf8');
      data = JSON.parse(f_data);
    } else {

      await logger.log('Not Found');
      data = {
        access: 0
      };
    }

    data.access++;
    fs.writeFileSync(f, JSON.stringify(data));

    await logger.log('Saved');
    await logger.log(JSON.stringify(data, '\t'));

  } catch (ex) {
    await logger.log(JSON.stringify(ex, '\t'));
  }
  

})();