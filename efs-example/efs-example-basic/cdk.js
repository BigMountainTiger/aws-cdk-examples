#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { EfsExampleBasicStack } = require('./stacks/efs-example-basic-stack');

const app = new cdk.App();
new EfsExampleBasicStack(app, 'EFS-Example-BASIC', {
  env: {
    account: '275118158658',
    region: 'us-east-1'
  }
});
