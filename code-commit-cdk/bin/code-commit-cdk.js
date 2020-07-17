#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CodeCommitCdkStack } = require('../lib/code-commit-cdk-stack');

const app = new cdk.App();
new CodeCommitCdkStack(app, 'CodeCommitCdkStack');
