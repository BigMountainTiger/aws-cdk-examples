const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');

class SlackNotifyApiStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ROLE_NAME = `${id}-LAMBDA-ROLE`;
    const LAMBDA_NAME = `${id}-LAMBDA`;
    const API_NAME = `${id}-APIGW`;

    const add_lambda_role = () => {
      const role = new iam.Role(this, ROLE_NAME, {
        roleName: ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }))

      return role;
    };

    const add_lambda = (role, path, FUNCTION_NAME) => {

      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: FUNCTION_NAME,
        timeout: cdk.Duration.seconds(120),
        role: role,
        code: lambda.Code.fromAsset(path),
        handler: 'index.handler'
      });

      return func;
    };

    const role = add_lambda_role();
    const handler = add_lambda(role, './lambda', LAMBDA_NAME);

    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME,
      endpointTypes: [apigateway.EndpointType.REGIONAL]
    });

    const endpoint = api.root.addResource('call-back');
    endpoint.addMethod('GET', new apigateway.LambdaIntegration(handler, { proxy: true }));

  }
}

module.exports = { SlackNotifyApiStack }
