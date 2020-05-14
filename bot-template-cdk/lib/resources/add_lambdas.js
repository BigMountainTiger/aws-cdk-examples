const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

const NAME = require('./NAME');

const add_lambda_role = (scope) => {
  const name = NAME.SLACK_BOT_LAMBDA_ROLE_NAME;
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

  const name = NAME.SLACK_BOT_DEPENDENCY_LAYER_NAME;
  const l = new lambda.LayerVersion(scope, name, {
    layerVersionName: name,
    code: lambda.Code.fromAsset('./lambdas/slack-bot-dependency-layer'),
    compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
    description: name
  });

  return l;
};

const add_publisher_lambda = (scope, role, layer) => {

  const name = NAME.SLACK_BOT_SQS_PUBLISHER_NAME;
  const f = new lambda.Function(scope, name, {
    runtime: lambda.Runtime.NODEJS_12_X,
    functionName: name,
    description: name,
    timeout: cdk.Duration.seconds(10),
    role: role,
    code: lambda.Code.asset('./lambdas/slack-bot-sqs-publisher'),
    layers: [layer],
    handler: 'index.handler'
  });

  return f;
};

const add_consumer_lambda = (scope, role, layer) => {
  const name = NAME.SLACK_BOT_SQS_CONSUMER_NAME;
  const f = new lambda.Function(scope, name, {
    runtime: lambda.Runtime.NODEJS_12_X,
    functionName: name,
    description: name,
    timeout: cdk.Duration.minutes(4),
    role: role,
    code: lambda.Code.asset('./lambdas/slack-bot-sqs-consumer'),
    layers: [layer],
    handler: 'index.handler'
  });

  return f;
};

module.exports = (scope) => {
  const role = add_lambda_role(scope);
  const layer = add_dependency_layer(scope);
  const sqs_publisher = add_publisher_lambda(scope, role, layer);
  const sqs_consumer = add_consumer_lambda(scope, role, layer);
  
  return {
    sqs_publisher: sqs_publisher,
    sqs_consumer: sqs_consumer
  };
};