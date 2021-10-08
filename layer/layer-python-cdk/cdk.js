#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { LayerPythonCdkStack } = require('./stack/layer-python-cdk-stack');

const app = new cdk.App();
const NAME = 'LAYER-Python-Cdk-STACK';
new LayerPythonCdkStack(app, NAME);
