#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { StepFunctionParallelCdkStack } = require('./stack/step-function-parallel-cdk-stack');

const app = new cdk.App();
const NAME = 'STEP-FUNCTION-PARALLEL-CDK-STACK';
new StepFunctionParallelCdkStack(app, NAME, {
  description: NAME
});
