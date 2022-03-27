#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { KinesisExampleStack } = require('./stacks/kinesis-example-stack');

const app = new cdk.App();
new KinesisExampleStack(app, 'KinesisExample-STACK', {});
