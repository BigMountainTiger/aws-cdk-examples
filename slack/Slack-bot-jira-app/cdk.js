#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { BotTemplateCdkStack } = require('./lib/slack-bot-jira-app-stack');

const app = new cdk.App();
const STACK_NAME = 'SLACK-BOT-JIRA-APP-STACK';
new BotTemplateCdkStack(app, STACK_NAME, {
  description: STACK_NAME
});
