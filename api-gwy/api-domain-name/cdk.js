#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { ApiDomainNameStack } = require('./stacks/api-domain-name-stack');

const app = new cdk.App();
new ApiDomainNameStack(app, 'ApiDomainNameStack', {});