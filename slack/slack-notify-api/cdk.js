#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { SlackNotifyApiStack } = require('./stack/slack-notify-api-stack');

const app = new cdk.App();
const NAME = 'SLACK-NOTIFY-API-STACK';
new SlackNotifyApiStack(app, NAME, {
  description: NAME
});
