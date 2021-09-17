#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { SqsCrossAccountAccessStack } = require('./stacks/sqs-cross-account-access-stack');

const app = new cdk.App();
new SqsCrossAccountAccessStack(app, 'SQS-Cross-Account-Access-Stack', {});