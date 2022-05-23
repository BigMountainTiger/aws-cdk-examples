const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigateway = require('aws-cdk-lib/aws-apigateway');

class ApiGwBasicStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const role = (() => {
      const ROLE_NAME = `${id}-LAMBDA-ROLE`;
      const role = new iam.Role(this, ROLE_NAME, {
        roleName: ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      return role;

    })();

    const func = (() => {

      const FUNCTION_NAME = `${id}-Example-Lmabda`;
      const path = './lambdas/example_lambda';
      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.PYTHON_3_9,
        role: role,
        functionName: FUNCTION_NAME,
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        code: lambda.Code.fromAsset(path),
        handler: 'app.lambdaHandler'
      });

      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      });

      return func;
    })();

    const api = (() => {

      const API_NAME = `${id}-API`;
      const api = new apigateway.RestApi(this, API_NAME, {
        restApiName: API_NAME,
        description: API_NAME,
        endpointTypes: [apigateway.EndpointType.REGIONAL]
      });

      let r = api.root.addResource('get');
      r.addMethod('GET', new apigateway.LambdaIntegration(func, { proxy: true }));

      return api;
    })();

  }
}

module.exports = { ApiGwBasicStack }
