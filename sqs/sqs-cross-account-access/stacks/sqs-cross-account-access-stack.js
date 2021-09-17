const cdk = require('@aws-cdk/core');
const sqs = require('@aws-cdk/aws-sqs');
const iam = require('@aws-cdk/aws-iam');

class SqsCrossAccountAccessStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const add_sqs = () => {

      const name = `${id}-TEST-QUEUE.fifo`
      const queue = new sqs.Queue(this, name, {
        queueName: name,
        fifo: true,
        receiveMessageWaitTime: cdk.Duration.seconds(20),
        visibilityTimeout: cdk.Duration.minutes(3)
      });
  
      const principle = new iam.AnyPrincipal();
      queue.grantSendMessages(principle);
      queue.grantConsumeMessages(principle);

      return queue;
    };

    const queue = add_sqs()
  }
}

module.exports = { SqsCrossAccountAccessStack }
