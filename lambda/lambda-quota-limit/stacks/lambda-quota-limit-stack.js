const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');
const apigateway = require('@aws-cdk/aws-apigateway');

class LambdaQuotaLimitStack extends cdk.Stack {
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

    const LAMBDA_NAME = `${id}-Limit-Test`;
    const func = new lambda.Function(this, LAMBDA_NAME, {
      runtime: lambda.Runtime.PYTHON_3_9,
      functionName: LAMBDA_NAME,
      description: LAMBDA_NAME,
      role: role,
      code: lambda.Code.fromAsset('lambdas/limit'),
      handler: 'app.lambdaHandler',
      timeout: cdk.Duration.seconds(30),
      memorySize: 128 * 2
    });

    func.addPermission('ApiAccessPermission', {
      principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
    })

    const API_NAME = `${id}-AGWY`;
    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME
    });

    api.root.addResource('{count}')
      .addMethod('GET', new apigateway.LambdaIntegration(func, { proxy: true }));

  }
}

module.exports = { LambdaQuotaLimitStack }
