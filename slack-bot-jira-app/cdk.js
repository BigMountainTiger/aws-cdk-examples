#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { BotTemplateCdkStack } = require('./lib/slack-bot-jira-app-stack');

const app = new cdk.App();
new BotTemplateCdkStack(app, 'SLACK-BOT-JIRA-APP-STACK');
