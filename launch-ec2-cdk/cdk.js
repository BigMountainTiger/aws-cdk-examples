#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { LaunchEc2CdkStack } = require('./stacks/launch-ec2-cdk-stack');

const app = new cdk.App();
const NAME = 'LAUNCH-EC2-CDK-STACK';
new LaunchEc2CdkStack(app, NAME, { description: NAME });
