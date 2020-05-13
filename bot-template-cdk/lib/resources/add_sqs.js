const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const sqs = require('@aws-cdk/aws-sqs');
const NAME = 'TEST_TECH_SUPPORT_QUEUE';

const add_sqs = (scope) => {

  const queue = new sqs.Queue(scope, NAME, {
    queueName: NAME,
    receiveMessageWaitTime: cdk.Duration.seconds(20),
    visibilityTimeout: cdk.Duration.minutes(5)
  });

  const principle = new iam.AnyPrincipal();
  queue.grant(principle, ['SQS:*']);

  return queue;
};

module.exports = add_sqs;