#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { EventBridgeHelloWorldStack } = require('./stacks/event-bridge-hello-world-stack');

const app = new cdk.App();
new EventBridgeHelloWorldStack(app, 'EventBridgeHelloWorldStack', {});
