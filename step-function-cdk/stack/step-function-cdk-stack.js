const cdk = require('@aws-cdk/core');
const step_test_bucket = require('./resources/step-test-bucket');
const step_put_s3_entry_lambda = require('./resources/step-put-s3-entry-lambda');
const step_test_function_machine = require('./resources/step-test-function-machine');
const step_example_step_1_lambda = require('./resources/step-example-step-1-lambda');

class StepFunctionCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    step_test_bucket(this);
    const step_1_lambda = step_example_step_1_lambda(this);
    const s3_put_lambda = step_put_s3_entry_lambda(this);
    step_test_function_machine(this, step_1_lambda, s3_put_lambda);
  }
}

module.exports = { StepFunctionCdkStack }
