// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

exports.lambdaHandler = async (event, context) => {
  const sfn = new AWS.StepFunctions();

  const input = {
    param1: 'This is the parameter No.1'
  };

  const params = {
    stateMachineArn: 'arn:aws:states:us-east-1:275118158658:stateMachine:TEST_STATE_MACHINE',
    input: JSON.stringify(input)
  };

  const result = await sfn.startExecution(params).promise();
  console.log(result);

  return result;
};