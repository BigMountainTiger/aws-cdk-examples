#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { DotnetLambdaLayerCdkStack } = require('./stack/dotnet-lambda-layer-cdk-stack');

const app = new cdk.App();
const NAME = 'DOTNET-LambdaLayer-CDK-STACK';
new DotnetLambdaLayerCdkStack(app, NAME, {});