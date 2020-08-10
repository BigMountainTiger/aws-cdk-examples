const apigateway = require('@aws-cdk/aws-apigateway');
const NAME = require('./NAME');

const add_api = (scope, sqs_publisher, direct_jira_lambda) => {

  const name = NAME.SLACK_BOT_SQS_PUBLISHER_API_NAME;
  const api = new apigateway.RestApi(scope, name, {
    restApiName: name,
    description: name,
    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS
    },
    endpointTypes: [apigateway.EndpointType.REGIONAL]
  });

  const slack_endpoint = api.root.addResource('slack');
  slack_endpoint.addMethod('POST', new apigateway.LambdaIntegration(sqs_publisher, { proxy: true }));

  const service_desk = api.root.addResource('service-desk');
  const create_endpoint = service_desk.addResource('create');
  create_endpoint.addMethod('POST', new apigateway.LambdaIntegration(direct_jira_lambda, { proxy: true }));

  const attach_endpoint = service_desk.addResource('attach').addResource('{key}').addResource('{filename}');
  attach_endpoint.addMethod('POST', new apigateway.LambdaIntegration(direct_jira_lambda, { proxy: true }));
};

module.exports = add_api;