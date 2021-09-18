#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { SqsLambdaExceptionStack } = require('./stacks/sqs-lambda-exception-stack');

const app = new cdk.App();
new SqsLambdaExceptionStack(app, 'SQS-Lambda-Exception-STACK', {});