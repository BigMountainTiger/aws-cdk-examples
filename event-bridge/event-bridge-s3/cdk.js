#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { EventBridgeS3Stack } = require('./stacks/event-bridge-s3-stack');

const app = new cdk.App();
new EventBridgeS3Stack(app, 'EventBridgeS3Stack', {});
