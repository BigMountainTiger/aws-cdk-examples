#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { ApiSnowflakeExternalFunctionCdkStack } = require('./stack/api-snowflake-external-function-cdk-stack');

const app = new cdk.App();
new ApiSnowflakeExternalFunctionCdkStack(app, 'ApiSnowflakeExternalFunctionCdkStack', {});