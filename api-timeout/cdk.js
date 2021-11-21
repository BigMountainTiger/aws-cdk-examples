#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { ApiTimeoutStack } = require('./stacks/api-timeout-stack');

const app = new cdk.App();
new ApiTimeoutStack(app, 'ApiTimeoutStack', {});