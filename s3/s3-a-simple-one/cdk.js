#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { S3ASimpleOneStack } = require('./stacks/s3-a-simple-one-stack');

const app = new cdk.App();
new S3ASimpleOneStack(app, 'S3-A-Simple-One-STACK', {});
