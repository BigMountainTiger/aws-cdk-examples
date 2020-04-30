#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { ApiCdkStack } = require('./lib/api-cdk-stack');

const app = new cdk.App();
new ApiCdkStack(app, 'ApiCdkStack');
