#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { DockerEcrCdkStack } = require('./stacks/docker-ecr-cdk-stack');

const app = new cdk.App();
const NAME = 'DOCKER-ECR-CDK-STACK';
new DockerEcrCdkStack(app, NAME, {
  description: NAME
});
