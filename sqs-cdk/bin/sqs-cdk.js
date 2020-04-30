#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { SqsCdkStack } = require('./lib/sqs-cdk-stack');

const app = new cdk.App();
new SqsCdkStack(app, 'SqsCdkStack');
