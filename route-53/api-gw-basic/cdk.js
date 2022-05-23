#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { ApiGwBasicStack } = require('./stacks/api-gw-basic-stack');

const app = new cdk.App();
new ApiGwBasicStack(app, 'API-GW-Basic-STACK', {});
