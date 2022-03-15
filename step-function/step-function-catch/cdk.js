#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { StepFunctionCatchStack } = require('./stacks/step-function-catch-stack');

const app = new cdk.App();
new StepFunctionCatchStack(app, 'STEP-FUNCTION-CATCH', {});
