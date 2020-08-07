const cdk = require('@aws-cdk/core');

class StepFunctionExampleCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);
  }
}

module.exports = { StepFunctionExampleCdkStack }
