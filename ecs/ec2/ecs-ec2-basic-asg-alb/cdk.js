#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { EcsEc2Basic_ecr_Stack, EcsEc2BasicStack } = require('./stacks/ecs-ec2-basic-stack');

const app = new cdk.App();
new EcsEc2Basic_ecr_Stack(app, 'ECS-EC2-Basic-ECR-STACK', {});
new EcsEc2BasicStack(app, 'ECS-EC2-Basic-STACK', {
    env: {
        account: '275118158658',
        region: 'us-east-1'
    }
});
