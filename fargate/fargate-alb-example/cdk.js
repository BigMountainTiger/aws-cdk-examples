#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { FargateAlbExampleStack } = require('./stacks/fargate-alb-example-stack');

const app = new cdk.App();
new FargateAlbExampleStack(app, 'FargateAlbExampleStack', {});
