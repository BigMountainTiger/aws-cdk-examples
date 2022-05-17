const cdk = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
const iam = require('aws-cdk-lib/aws-iam');
const apigateway = require('aws-cdk-lib/aws-apigateway');

class ApiASimpleExampleStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const NAME = 'LAMBDA-ROLE';
    const role = (() => {
      const role = new iam.Role(this, `${id}-${NAME}`, {
        roleName: NAME,
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

      const NAME = 'EXAMPLE-LAMBDA';
      const func = new lambda.Function(this, `${id}-${NAME}`, {
        runtime: lambda.Runtime.NODEJS_14_X,
        functionName: NAME,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.fromAsset('./lambdas/AFunction'),
        handler: 'index.handler'
      });

      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      })

      return func;

    })();

    const api = (() => {
      const NAME = 'EXAMPLE-API-GW';

      const api = new apigateway.RestApi(this, `${id}-${NAME}`, {
        restApiName: NAME,
        description: NAME,
        endpointTypes: [apigateway.EndpointType.REGIONAL]
      });

      return api;

    })();

    const resource = api.root.addResource('example');
    resource.addMethod('GET', new apigateway.LambdaIntegration(func, { proxy: true }));

  }
}

module.exports = { ApiASimpleExampleStack }
