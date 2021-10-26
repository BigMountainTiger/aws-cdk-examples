const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');

class DynamoLambdaConcurrentStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const role = (() => {
      const ROLE_NAME = `${id}-Lambda-Role`;
      const principal = new iam.ServicePrincipal('lambda.amazonaws.com');
      const role = new iam.Role(this, ROLE_NAME, { roleName: ROLE_NAME, assumedBy: principal });

      const actions = ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'];
      role.addToPolicy(new iam.PolicyStatement({ effect: iam.Effect.ALLOW, resources: ['*'], actions: actions }));

      return role;
    })();

    const func = (() => {

      const FUNCTION_NAME = `${id}-Lambda`;
      const path = 'lambdas/no-concurrency-lambda';

      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.PYTHON_3_9,
        functionName: FUNCTION_NAME,
        memorySize: 256,
        timeout: cdk.Duration.seconds(120),
        role: role,
        code: lambda.Code.fromAsset(path),
        handler: 'app.lambdaHandler',
        reservedConcurrentExecutions: 1
        // This does provide single instance lambda execution, but
        // It throws error to any other attempts to execute with NO WAIT
      });

      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      })

      return func;
    })();

    const api = (() => {
      const API_NAME = `${id}-API-GW`
      return  new apigateway.RestApi(this, API_NAME, {
        restApiName: API_NAME,
        description: API_NAME,
        endpointTypes: [apigateway.EndpointType.REGIONAL]
      });
    })();

    api.root.addMethod('GET', new apigateway.LambdaIntegration(func, { proxy: true }));

  }
}

module.exports = { DynamoLambdaConcurrentStack }
