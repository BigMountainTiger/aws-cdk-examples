#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { FargateTask2022Stack } = require('./stacks/fargate-task-2022-stack');

const app = new cdk.App();
new FargateTask2022Stack(app, 'FargateTask2022Stack', {});
