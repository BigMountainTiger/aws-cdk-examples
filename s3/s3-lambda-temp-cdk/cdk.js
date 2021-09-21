#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { S3LambdaTempCdkStack } = require('./lib/s3-lambda-temp-cdk-stack');

const app = new cdk.App();
const NAME = 'S3-LAMBDA-TEMP-CDK-STACK';
new S3LambdaTempCdkStack(app, NAME, {
  description: NAME
});
