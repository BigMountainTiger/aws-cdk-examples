#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CodeArtifactCdkStack } = require('./stacks/code-artifact-cdk-stack');

const app = new cdk.App();
new CodeArtifactCdkStack(app, 'CodeArtifactCdkStack');
