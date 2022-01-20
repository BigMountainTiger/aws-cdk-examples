#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { StepFunctionChoiceStack } = require('./stacks/step-function-choice-stack');

const app = new cdk.App();
new StepFunctionChoiceStack(app, 'StepFunctionChoiceStack', {});
