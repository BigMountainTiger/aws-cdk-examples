#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { LayerCdkStack } = require('./bin/layer-cdk-stack');

const app = new cdk.App();
new LayerCdkStack(app, 'LayerCdkStack');
