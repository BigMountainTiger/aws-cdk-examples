#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { RepositoryCdkStack } = require('./lib/repository-cdk-stack');

const app = new cdk.App();
new RepositoryCdkStack(app, 'RepositoryCdkStack');
