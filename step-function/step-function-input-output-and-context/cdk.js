#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { StepFunctionInputOutputAndContextStack } = require('./stacks/main-stack');

const app = new cdk.App();
new StepFunctionInputOutputAndContextStack(app, 'SFN-INPUT-OUTPUT-CONTEXT', {});
