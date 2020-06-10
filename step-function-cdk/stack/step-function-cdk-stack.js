const cdk = require('@aws-cdk/core');
const step_test_bucket = require('./resources/step-test-bucket');

class StepFunctionCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    step_test_bucket(this);
  }
}

module.exports = { StepFunctionCdkStack }
