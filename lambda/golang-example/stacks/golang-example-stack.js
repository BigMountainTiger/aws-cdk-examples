const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigateway = require('aws-cdk-lib/aws-apigateway');

class GolangExampleStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const LAMBDA_ROLE_NAME = `${id}-LAMBDA_ROLE`;
    const role = new iam.Role(this, LAMBDA_ROLE_NAME, {
      roleName: LAMBDA_ROLE_NAME,
      description: LAMBDA_ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
    }));

    const LAMBDA_NAME = `${id}-lambda`;
    const func = new lambda.Function(this, LAMBDA_NAME, {
      runtime: lambda.Runtime.GO_1_X,
      functionName: LAMBDA_NAME,
      description: LAMBDA_NAME,
      role: role,
      code: lambda.Code.fromAsset('lambdas/golang_example/.go-build/executable.zip'),
      handler: 'executable',
      timeout: cdk.Duration.seconds(30),
      memorySize: 128 * 1
    });

    const API_NAME = `${id}-AGWY`;
    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME
    });

    api.root.addMethod('GET', new apigateway.LambdaIntegration(func, { proxy: true }));

  }
}

module.exports = { GolangExampleStack }
