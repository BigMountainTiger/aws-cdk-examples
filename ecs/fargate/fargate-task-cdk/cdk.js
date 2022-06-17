#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { FargateTaskCdkStack } = require('./stacks/fargate-task-cdk-stack');

const app = new cdk.App();
const NAME = 'FARGATE-TASK-CDK-STACK'
new FargateTaskCdkStack(app, NAME, {
  description: NAME
});
