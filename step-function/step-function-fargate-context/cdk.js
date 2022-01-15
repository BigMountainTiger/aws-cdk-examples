#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { StepFunctionFargateContextStack } = require('./stacks/step-function-fargate-context-stack');

const app = new cdk.App();
new StepFunctionFargateContextStack(app, 'SFN-Fargate-CONTEXT', {});
