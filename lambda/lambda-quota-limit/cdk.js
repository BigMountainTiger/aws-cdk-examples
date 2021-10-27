#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { LambdaQuotaLimitStack } = require('./stacks/lambda-quota-limit-stack');

const app = new cdk.App();
new LambdaQuotaLimitStack(app, 'LAMBDA-Quota-Limit-STACK', {});