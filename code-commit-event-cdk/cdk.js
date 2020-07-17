#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CodeCommitCdkStack } = require('./stacks/code-commit-cdk-stack');

const app = new cdk.App();
const NAME = 'CODE-COMMIT-CDK-STACK';
new CodeCommitCdkStack(app, NAME, {
  description: NAME
});
