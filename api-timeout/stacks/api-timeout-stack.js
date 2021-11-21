const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');
const apigateway = require('@aws-cdk/aws-apigateway');

class ApiTimeoutStack extends cdk.Stack {

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

      const FUNCTION_NAME = `${id}-API-Lambda`;
      const path = './lambdas/api_lambda';
      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.PYTHON_3_9,
        role: role,
        functionName: FUNCTION_NAME,
        memorySize: 1024,
        timeout: cdk.Duration.seconds(120),
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
      return  new apigateway.RestApi(this, API_NAME, {
        restApiName: API_NAME,
        description: API_NAME,
        endpointTypes: [apigateway.EndpointType.REGIONAL]
      });
    })();

    api.root.addMethod('POST', new apigateway.LambdaIntegration(func, { proxy: true }));

  }
}

module.exports = { ApiTimeoutStack }
