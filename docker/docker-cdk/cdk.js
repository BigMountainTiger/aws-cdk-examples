#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { ExampleWebDockerCdkStack } = require('./stack/example-web-docker-cdk-stack');
const { ExampleTaskDockerCdkStack } = require('./stack/example-task-docker-cdk-stack');

const app = new cdk.App();

const EXAMPLE_WEB_NAME = 'EXAMPLE-WEB-DOCKER-CDK-STACK';
new ExampleWebDockerCdkStack(app, EXAMPLE_WEB_NAME, {
  description: EXAMPLE_WEB_NAME
});

const EXAMPLE_TASK_NAME = 'EXAMPLE-TASK-DOCKER-CDK-STACK';
new ExampleTaskDockerCdkStack(app, EXAMPLE_TASK_NAME, {
  description: EXAMPLE_TASK_NAME
});
