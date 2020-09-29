#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { FargateStepFunctionCdkStack } = require('./stacks/fargate-step-function-cdk-stack');

const app = new cdk.App();

new FargateStepFunctionCdkStack(app, 'FargateStepFunctionCdkStack');
