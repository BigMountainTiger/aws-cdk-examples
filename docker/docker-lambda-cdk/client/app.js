const fs = require('fs');
const aws = require('aws-sdk');
const lambda = new aws.Lambda({ region: 'us-east-1' });

const lambda_name = 'DOCKER-Lambda-CDK-STACK-IN';

(async () => {

  const result = await lambda.invoke({
    FunctionName: lambda_name,
    Payload: JSON.stringify('This is the payload')
  }).promise();

  console.log(result);

})();

