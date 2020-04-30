// https://docs.aws.amazon.com/cdk/api/latest/docs/aws-iam-readme.html

const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const sqs = require('@aws-cdk/aws-sqs');
const iam = require('@aws-cdk/aws-iam');
const eventSources = require('@aws-cdk/aws-lambda-event-sources');

class SqsCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const add_lambda_role = () => {
      const role = new iam.Role(this, 'MyRole', {
        roleName: 'MyRole',
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

    const add_sqs = () => {

      const queue = new sqs.Queue(this, 'ATestSQSQueue', {
        queueName: 'ATestSQSQueue',
        receiveMessageWaitTime: cdk.Duration.seconds(20),
        visibilityTimeout: cdk.Duration.minutes(3)
      });
  
      const principle = new iam.AnyPrincipal();
      queue.grantSendMessages(principle);
      queue.grantConsumeMessages(principle);

      return queue;
    };

    const add_consumer_lambda = (role) => {

      const name = 'ATestSQSConsumerFunction'
      const f = new lambda.Function(this, name, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: name,
        timeout: cdk.Duration.seconds(120),
        role: role,
        code: lambda.Code.asset('./lambda/sqs-consumer'),
        handler: 'index.handler'
      });

      return f;
    };

    const add_publisher_lambda = (role) => {

      const name = 'ATestSQSPublisherFunction'
      const f = new lambda.Function(this, name, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: name,
        timeout: cdk.Duration.seconds(3),
        role: role,
        code: lambda.Code.asset('./lambda/sqs-publisher'),
        handler: 'index.handler'
      });

      return f;
    };

    const lambda_role = add_lambda_role();
    const q = add_sqs();
    const consumer_lambda = add_consumer_lambda(lambda_role);
    add_publisher_lambda(lambda_role);

    //consumer_lambda.addEventSource(new eventSources.SqsEventSource(q, { batchSize: 1 }));
  }
}

module.exports = { SqsCdkStack }
