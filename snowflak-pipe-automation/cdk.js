#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { SnowflakPipeAutomationStack } = require('./lib/snowflak-pipe-automation-stack');

const app = new cdk.App();
const STACK_NAME = 'SNOWFLAKE-PIPE-AUTOMATION-STACK';
new SnowflakPipeAutomationStack(app, STACK_NAME, {
  description: STACK_NAME
});
