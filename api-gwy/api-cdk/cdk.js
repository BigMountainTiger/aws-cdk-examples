#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { ApiCdkStack } = require('./stack/api-cdk-stack');

const NAME = 'API-CDK-STACK';
const app = new cdk.App();
new ApiCdkStack(app, NAME, {
  description: NAME
});
