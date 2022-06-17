#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { CodeguruProfilerCdkStack } = require('./stacks/codeguru-profiler-cdk-stack');

const app = new cdk.App();
new CodeguruProfilerCdkStack(app, 'Codeguru-Profiler-Cdk-STACK', {});
