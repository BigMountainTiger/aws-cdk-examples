const { Stack, Duration } = require('aws-cdk-lib');
const sqs = require('aws-cdk-lib/aws-sqs');

class VpcBasicStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

  }
}

module.exports = { VpcBasicStack }
