#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { DynamoCdkStack } = require('../lib/dynamo-cdk-stack');

const app = new cdk.App();
new DynamoCdkStack(app, 'DynamoCdkStack');
