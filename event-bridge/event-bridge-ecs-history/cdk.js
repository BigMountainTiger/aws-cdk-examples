#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { EventBridgeEcsHistoryStack } = require('./stacks/event-bridge-ecs-history-stack');

const app = new cdk.App();
new EventBridgeEcsHistoryStack(app, 'EventBridgeEcsHistoryStack', {});
