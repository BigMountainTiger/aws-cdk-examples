const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const kinesis = require('aws-cdk-lib/aws-kinesis');
const lambda = require('aws-cdk-lib/aws-lambda');
const sqs = require('aws-cdk-lib/aws-sqs');
const event_sources = require('aws-cdk-lib/aws-lambda-event-sources');

class KinesisExampleStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const stream = (() => {

      const NAME = 'MY-TEST-STREAM';
      const stream = new kinesis.Stream(this, `${id}-${NAME}`, {
        streamName: NAME,
        shardCount: 1
      });

      stream.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

      return stream;

    })();

    const role = (() => {

      const NAME = 'LAMBDA-ROLE';
      const role = new iam.Role(this, `${id}-${NAME}`, {
        roleName: NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      return role;

    })();

    stream.grantRead(role);
    const create_func = (NAME) => {
      const func = new lambda.Function(this, `${id}-${NAME}`, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: NAME,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.asset('./lambda/kinesis-consumer'),
        memorySize: 128,
        handler: 'app.lambdaHandler'
      });

      return func;
    };

    const func_1 = create_func('kinesis-consumer-1');
    const func_2 = create_func('kinesis-consumer-2');

    const queue = (() => {
      const NAME = 'Kinesis-DEAD-LETTER';
      return new sqs.Queue(this, `${id}-${NAME}`, {
        queueName: NAME,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });
    })();

    // https://docs.aws.amazon.com/lambda/latest/dg//with-kinesis.html#services-kinesis-errors
    // No detail included in the dead-letter queue
    // Each failed lambda will dump a message to the dead-letter queue, no details included. Need to query the Kinesis for the data
    const event_source = new event_sources.KinesisEventSource(stream, {
      batchSize: 100,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      retryAttempts: 0,
      onFailure: new event_sources.SqsDlq(queue)
    });

    // Kinesis messages delivered to all the subscribers, not like SQS
    func_1.addEventSource(event_source);
    func_2.addEventSource(event_source);

  }
}

module.exports = { KinesisExampleStack }
