const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

const NAME = require('./NAME');

const add_lambda_role = (scope) => {
  const role = new iam.Role(scope, NAME.SLACK_BOT_LAMBDA_ROLE, {
    roleName: NAME.SLACK_BOT_LAMBDA_ROLE,
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

const add_publisher_lambda = (scope, role) => {

  const name = NAME.SLACK_BOT_SQS_PUBLISHER_NAME;
  const f = new lambda.Function(scope, name, {
    runtime: lambda.Runtime.NODEJS_12_X,
    functionName: name,
    timeout: cdk.Duration.seconds(3),
    role: role,
    code: lambda.Code.asset('./lambdas/slack-bot-sqs-publisher'),
    handler: 'index.handler'
  });

  return f;
};

module.exports = (scope) => {
  const role = add_lambda_role(scope);
  add_publisher_lambda(scope, role)
};