#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { VpcExampleCdkStack } = require('./stacks/vpc-example-cdk-stack');

const app = new cdk.App();
const NAME = 'VPC-EXAMPLE-Cdk-STACK';
new VpcExampleCdkStack(app, NAME, {
  description: NAME
});
