#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { DockerLambdaCdkStack } = require('./stacks/docker-lambda-cdk-stack');

const app = new cdk.App();
new DockerLambdaCdkStack(app, 'DOCKER-Lambda-RECEIPT-SINGLE-STACK');
