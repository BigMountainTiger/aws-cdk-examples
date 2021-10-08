const cdk = require('@aws-cdk/core');
const { StepFunctionExampleCdkStack }
  = require('./stacks/step-function-example-cdk-stack');

const app = new cdk.App();
const NAME = 'STEP-FUNCTION-EXAMPLE-CDK-STACK';
new StepFunctionExampleCdkStack(app, NAME, {
  description: NAME
});
