#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { WebsocketCdkStack } = require('./stacks/websocket-cdk-stack');

const app = new cdk.App();
new WebsocketCdkStack(app, 'WebsocketCdkStack');
