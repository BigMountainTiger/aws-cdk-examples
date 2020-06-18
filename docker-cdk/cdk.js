#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { ExampleWebDockerCdkStack } = require('./stack/example-web-docker-cdk-stack');

const app = new cdk.App();
const NAME = 'EXAMPLE-WEB-DOCKER-CDK-STACK';
new ExampleWebDockerCdkStack(app, NAME, {
  description: NAME
});
