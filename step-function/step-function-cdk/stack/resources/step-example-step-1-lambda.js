// STEPPUTS3ENTRYLAMBDAB74EF8C7

const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

const add_lambda = (scope) => {

  const role_name = 'STEP_EXAMPLE_STEP_1_LAMBDA_ROLE';
  const role = new iam.Role(scope, role_name, {
    roleName: role_name,
    description: role_name,
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  role.addToPolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    resources: ['*'],
    actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
  }));

  const lambda_name = 'STEP_EXAMPLE_STEP_1_LAMBDA';
  return new lambda.Function(scope, lambda_name, {
    runtime: lambda.Runtime.NODEJS_12_X,
    functionName: lambda_name,
    description: lambda_name,
    timeout: cdk.Duration.seconds(15),
    role: role,
    code: lambda.Code.asset('./lambdas/step-example-step-1-lambda'),
    memorySize: 256,
    handler: 'app.lambdaHandler'
  });
};

module.exports = add_lambda;