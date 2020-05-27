const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

const NAME = require('./NAME');


const add_lambda_role = (scope) => {
  const name = NAME.SNOWFLAKE_S3_PIPE_LAMBDA_ROLE_NAME;
  const role = new iam.Role(scope, name, {
    roleName: name,
    description: name,
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  role.addToPolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    resources: ['arn:aws:sqs:*'],
    actions: ['sqs:DeleteMessage', 'sqs:GetQueueAttributes', 'sqs:ReceiveMessage']
  }))

  role.addToPolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    resources: ['*'],
    actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
  }))

  return role;
};

const add_dependency_layer = (scope) => {

  const name = NAME.SNOWFLAKE_S3_PIPE_DEPENDENCY_LAYER_NAME;
  return new lambda.LayerVersion(scope, name, {
    layerVersionName: name,
    code: lambda.Code.fromAsset('./lambdas/snowflake-s3-pipe-dependency-layer'),
    compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
    description: name
  });
};

module.exports = (scope) => {
  const role = add_lambda_role(scope);
  const layer = add_dependency_layer(scope);
};