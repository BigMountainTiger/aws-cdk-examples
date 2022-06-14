#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { DynamoExcerciseStack } = require('./stacks/dynamo-excercise-stack');

const app = new cdk.App();
new DynamoExcerciseStack(app, 'Dynamo-Excercise-STACK', {});
