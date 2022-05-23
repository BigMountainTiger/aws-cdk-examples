#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { BatchBasicExampleStack } = require('./stacks/batch-basic-example-stack');

const app = new cdk.App();
new BatchBasicExampleStack(app, 'BATCH-BasicExample-STACK', {});
