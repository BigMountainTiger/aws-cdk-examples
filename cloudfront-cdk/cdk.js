#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CloudfrontCdkStack } = require('./stack/cloudfront-cdk-stack');

const app = new cdk.App();
new CloudfrontCdkStack(app, 'CloudfrontCdkStack');
