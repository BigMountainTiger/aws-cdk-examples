#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { S3EventCdkStack } = require('./lib/s3-event-cdk-stack');

const app = new cdk.App();
new S3EventCdkStack(app, 'S3EventCdkStack');
