#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { CodeguruProfilerLambdaStack } = require('./stacks/codeguru-profiler-lambda-stack');

const app = new cdk.App();
new CodeguruProfilerLambdaStack(app, 'CODEGURU-Profiler-Lambda-STACK', {});
