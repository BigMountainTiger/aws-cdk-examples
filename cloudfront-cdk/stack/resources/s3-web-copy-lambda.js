const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

const copy_lambda = (scope, id) => {

  const role_name = `${id}-COPY_LAMBDA_HANDLER_ROLE`;
  const role = new iam.Role(scope, role_name, {
    roleName: role_name,
    description: role_name,
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  role.addToPolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    resources: ['*'],
    actions: ['s3:*']
  }))

  role.addToPolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    resources: ['*'],
    actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
  }))

  const lambda_name = `${id}-COPY_LAMBDA_HANDLER`;
  return new lambda.Function(scope, lambda_name, {
    runtime: lambda.Runtime.NODEJS_12_X,
    functionName: lambda_name,
    description: lambda_name,
    timeout: cdk.Duration.seconds(15),
    role: role,
    code: lambda.Code.asset('./lambdas/s3-web-copy-lambda'),
    memorySize: 256,
    handler: 'index.lambdaHandler'
  });
};

module.exports = copy_lambda;