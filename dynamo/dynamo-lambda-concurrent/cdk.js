#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { DynamoLambdaConcurrentStack } = require('./stacks/dynamo-lambda-concurrent-stack');

const app = new cdk.App();
new DynamoLambdaConcurrentStack(app, 'DYNAMO-Lambda-Concurrent-STACK', {});