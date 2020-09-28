#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { SlackNotifyApiStack } = require('../lib/slack-notify-api-stack');

const app = new cdk.App();
new SlackNotifyApiStack(app, 'SlackNotifyApiStack');
