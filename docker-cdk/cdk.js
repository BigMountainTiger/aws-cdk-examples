#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { DockerCdkStack } = require('./stack/docker-cdk-stack');

const app = new cdk.App();
const NAME = 'DOCKER-CDK-STACK';
new DockerCdkStack(app, NAME, {
  description: NAME
});
