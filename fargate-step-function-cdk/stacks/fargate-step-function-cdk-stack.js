const cdk = require('@aws-cdk/core');

class FargateStepFunctionCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);
    
  }
}

module.exports = { FargateStepFunctionCdkStack }
