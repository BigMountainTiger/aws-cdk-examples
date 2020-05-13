#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { BotTemplateCdkStack } = require('./lib/bot-template-cdk-stack');

const app = new cdk.App();
new BotTemplateCdkStack(app, 'BotTemplateCdkStack');
