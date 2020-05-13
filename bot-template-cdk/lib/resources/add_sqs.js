const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const sqs = require('@aws-cdk/aws-sqs');
const NAME = require('./NAME');

const add_sqs = (scope) => {

  const queue = new sqs.Queue(scope, NAME.SQS_NAME, {
    queueName: NAME.SQS_NAME,
    receiveMessageWaitTime: cdk.Duration.seconds(20),
    visibilityTimeout: cdk.Duration.minutes(5)
  });

  const principle = new iam.AnyPrincipal();
  queue.grant(principle, ['SQS:*']);

  return queue;
};

module.exports = add_sqs;