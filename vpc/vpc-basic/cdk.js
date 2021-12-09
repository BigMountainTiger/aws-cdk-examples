#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { VpcBasicStack } = require('./stacks/vpc-basic-stack');

const app = new cdk.App();
new VpcBasicStack(app, 'VpcBasicStack', {});
