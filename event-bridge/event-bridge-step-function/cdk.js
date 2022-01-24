#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { EventBridgeStepFunctionStack } = require('./stacks/event-bridge-step-function-stack');

const app = new cdk.App();
new EventBridgeStepFunctionStack(app, 'EventBridgeStepFunctionStack', {});
