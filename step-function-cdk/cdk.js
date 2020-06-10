#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { StepFunctionCdkStack } = require('./stack/step-function-cdk-stack');

const app = new cdk.App();
const STACK_NAME = 'STEP-FUNCTION-CDK-STACK';
new StepFunctionCdkStack(app, STACK_NAME, {
  description: STACK_NAME
});
