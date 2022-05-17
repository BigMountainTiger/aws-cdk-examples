#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { ApiApikeyExampleStack } = require('./stacks/api-apikey-example-stack');

const app = new cdk.App();
new ApiApikeyExampleStack(app, 'APIApikeyExample-STACK', {});
