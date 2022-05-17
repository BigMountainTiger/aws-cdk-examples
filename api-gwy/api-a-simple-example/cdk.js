#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { ApiASimpleExampleStack } = require('./stacks/api-a-simple-example-stack');

const app = new cdk.App();
new ApiASimpleExampleStack(app, 'API-ASimple-Example-STACK', {});
