#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { SsmExampleStack } = require('./stack/ssm-example-stack');

const app = new cdk.App();
new SsmExampleStack(app, 'SSN-Example-STACK', {
});