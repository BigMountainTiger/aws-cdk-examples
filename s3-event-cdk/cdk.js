#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { S3EventCdkStack } = require('./lib/s3-event-cdk-stack');

const app = new cdk.App();

const STACK_NAME = 'S3-EVENT-CDK-STACK';
new S3EventCdkStack(app, STACK_NAME, {
  description: STACK_NAME
});
