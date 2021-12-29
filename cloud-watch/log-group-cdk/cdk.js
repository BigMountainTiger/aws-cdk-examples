#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { LogGroupCdkStack } = require('./stacks/log-group-cdk-stack');

const app = new cdk.App();
new LogGroupCdkStack(app, 'LogGroupCdkStack', {});
