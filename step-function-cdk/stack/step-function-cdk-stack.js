const cdk = require('@aws-cdk/core');
const step_test_bucket = require('./resources/step-test-bucket');
const step_put_s3_entry_lambda = require('./resources/step-put-s3-entry-lambda');
const step_test_function_machine = require('./resources/step-test-function-machine');

class StepFunctionCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    step_test_bucket(this);
    const step1_lambda = step_put_s3_entry_lambda(this);
    step_test_function_machine(this, step1_lambda);
  }
}

module.exports = { StepFunctionCdkStack }
