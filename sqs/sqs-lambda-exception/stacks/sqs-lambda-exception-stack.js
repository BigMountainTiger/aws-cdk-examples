const cdk = require('@aws-cdk/core');
const sqs = require('@aws-cdk/aws-sqs');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');
const eventSources = require('@aws-cdk/aws-lambda-event-sources');

class SqsLambdaExceptionStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const add_sqs = () => {

      const name = `${id}-TEST-QUEUE`;

      const dead_letter_queue_name = `${name}-DEAD-LETTER`;
      const dead_letter_queue = new sqs.Queue(this, dead_letter_queue_name, {
        queueName: dead_letter_queue_name
      });

      const queue = new sqs.Queue(this, name, {
        queueName: name,
        deadLetterQueue: {
          maxReceiveCount: 2,
          queue: dead_letter_queue
        },
        deliveryDelay: cdk.Duration.seconds(1), // The delay time before available to the queue
        receiveMessageWaitTime: cdk.Duration.seconds(20), // Long pooling wait time to get messages from the queue
        visibilityTimeout: cdk.Duration.minutes(3)
      });
  
      // const principle = new iam.AnyPrincipal();
      const account = '660079349745';
      const principle = new iam.AccountPrincipal(account);
      queue.grantSendMessages(principle);
      queue.grantConsumeMessages(principle);
      queue.grantPurge(principle);

      return queue;
    };

    const add_consumer_lambda = () => {

      const add_sqs_consumer_role = () => {
      
        const name = `${id}-SQS-CONSUMER`;
        const role = new iam.Role(this, name, {
          roleName: name,
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

      const role = add_sqs_consumer_role();
      const name = `${id}-SQS-Consumer-Function`;
      const func = new lambda.Function(this, name, {
        runtime: lambda.Runtime.NODEJS_14_X,
        functionName: name,
        timeout: cdk.Duration.seconds(120),
        role: role,
        code: lambda.Code.fromAsset('./lambdas/sqs-consumer'),
        handler: 'index.handler'
      });

      return func;
    };

    const queue = add_sqs();
    const func = add_consumer_lambda();

    func.addEventSource(new eventSources.SqsEventSource(queue, { batchSize: 1 }));
  }
}

module.exports = { SqsLambdaExceptionStack }
