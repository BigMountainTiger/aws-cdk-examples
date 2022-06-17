#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { EcsEc2BasicStack } = require('./stacks/ecs-ec2-basic-stack');

const app = new cdk.App();
new EcsEc2BasicStack(app, 'ECS-EC2-Basic-STACK', {});
