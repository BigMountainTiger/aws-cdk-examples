#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { FargateStepFunctionCdkStack } = require('./stacks/fargate-step-function-cdk-stack');
const { FargateRepositoryCdkStack } = require('./stacks/fargate-repository-cdk-stack');

const app = new cdk.App();
const STEP_FUNCTION_STACK_NAME = 'FARGATE-STEP-FUNCTION-Cdk-Stack';
new FargateStepFunctionCdkStack(app, STEP_FUNCTION_STACK_NAME, {
  description: STEP_FUNCTION_STACK_NAME
});

// This is a functonal stack (no bug). Commented out for simplicity
// const STEP_FUNCTION_REPOSITORY_NAME = 'FARGATE-STEP-FUNCTION-REPOSITORY-Cdk-Stack';
// new FargateRepositoryCdkStack(app, STEP_FUNCTION_REPOSITORY_NAME, {
//   description: STEP_FUNCTION_REPOSITORY_NAME
// });