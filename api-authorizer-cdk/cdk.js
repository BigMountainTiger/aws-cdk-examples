#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { ApiAuthorizerCdkStack } = require('./stack/api-authorizer-cdk-stack');

const app = new cdk.App();
new ApiAuthorizerCdkStack(app, 'API-AUTHORIZER-Cdk-STACK');
