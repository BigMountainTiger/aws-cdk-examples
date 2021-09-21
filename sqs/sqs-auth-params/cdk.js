#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { SqsAuthParamsStack } = require('./stacks/sqs-auth-params-stack');

const app = new cdk.App();
new SqsAuthParamsStack(app, 'SQS-AuthParams-STACK', {});