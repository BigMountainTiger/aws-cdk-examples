#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CodebuildCdkStack } = require('./stacks/codebuild-cdk-stack');

const app = new cdk.App();
const NAME = 'CODEBUILD-CDK-STACK';
new CodebuildCdkStack(app, NAME, {
  description: NAME
});
