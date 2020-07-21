#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { IamCdkStack } = require('./stacks/iam-cdk-stack');

const app = new cdk.App();
const NAME = 'IAM-USER-CDK-STACK';
new IamCdkStack(app, NAME, {
  description: NAME
});
