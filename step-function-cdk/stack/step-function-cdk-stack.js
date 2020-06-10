const cdk = require('@aws-cdk/core');
const step_test_bucket = require('./resources/step-test-bucket');
const step_put_s3_entry_lambda = require('./resources/step-put-s3-entry-lambda');

class StepFunctionCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    step_test_bucket(this);
    step_put_s3_entry_lambda(this);
  }
}

module.exports = { StepFunctionCdkStack }
