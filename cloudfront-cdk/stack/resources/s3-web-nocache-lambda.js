const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

const nocache_lambda = (scope, id) => {

  const role_name = `${id}-NOCACHE_LAMBDA_HANDLER_ROLE`;
  const role = new iam.Role(scope, role_name, {
    roleName: role_name,
    description: role_name,
    assumedBy: new iam.CompositePrincipal(
      new iam.ServicePrincipal('lambda.amazonaws.com'),
      new iam.ServicePrincipal('edgelambda.amazonaws.com')
    )
  });

  role.addToPolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    resources: ['*'],
    actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
  }))

  const lambda_name = `${id}-NOCACHE_LAMBDA_HANDLER`;
  const lambda_function = new lambda.Function(scope, lambda_name, {
    runtime: lambda.Runtime.NODEJS_12_X,
    functionName: lambda_name,
    description: lambda_name,
    timeout: cdk.Duration.seconds(5),
    role: role,
    code: lambda.Code.asset('./lambdas/s3-web-nocache-lambda'),
    memorySize: 128,
    handler: 'index.lambdaHandler'
  });

  return lambda_function;
};

module.exports = nocache_lambda;