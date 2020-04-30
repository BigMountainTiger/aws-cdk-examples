#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CloudTrailCdkStack } = require('./lib/cloud_trail-cdk-stack');

const app = new cdk.App();
new CloudTrailCdkStack(app, 'CloudTrailCdkStack');
