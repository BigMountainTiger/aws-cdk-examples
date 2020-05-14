const apigateway = require('@aws-cdk/aws-apigateway');
const NAME = require('./NAME');

const add_api = (scope, sqs_publisher) => {

  const name = NAME.SLACK_BOT_SQS_PUBLISHER_API_NAME;
  const api = new apigateway.RestApi(scope, name, {
    restApiName: name,
    description: name,
  });

  api.root.addMethod('POST', new apigateway.LambdaIntegration(sqs_publisher, { proxy: true }));
};

module.exports = add_api;