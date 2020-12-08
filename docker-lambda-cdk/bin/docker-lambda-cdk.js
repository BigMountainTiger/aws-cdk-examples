#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { DockerLambdaCdkStack } = require('../lib/docker-lambda-cdk-stack');

const app = new cdk.App();
new DockerLambdaCdkStack(app, 'DockerLambdaCdkStack');
