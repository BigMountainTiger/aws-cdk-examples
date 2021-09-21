const cdk = require('@aws-cdk/core');
const sqs = require('@aws-cdk/aws-sqs');

class SqsAuthParamsStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const name = `${id}-TEST-QUEUE`;
    new sqs.Queue(this, name, { queueName: name });
  }
}

module.exports = { SqsAuthParamsStack }
