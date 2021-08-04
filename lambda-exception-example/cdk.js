#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { LambdaExceptionExampleStack } = require('./stack/lambda-exception-example-stack');

const app = new cdk.App();
new LambdaExceptionExampleStack(app, 'LambdaExceptionExampleStack', {});