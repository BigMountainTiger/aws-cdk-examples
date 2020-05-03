#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CognitoCdkStack } = require('./lib/cognito-cdk-stack');

const app = new cdk.App();
new CognitoCdkStack(app, 'CognitoCdkStack');
