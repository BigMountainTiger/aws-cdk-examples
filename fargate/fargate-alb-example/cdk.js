#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { FargateAlbExample_ecr_Stack, FargateAlbExampleStack } = require('./stacks/fargate-alb-example-stack');

const app = new cdk.App();
new FargateAlbExample_ecr_Stack(app, 'FargateAlbExample-ECR-Stack', {});
new FargateAlbExampleStack(app, 'FargateAlbExampleStack', {});

// The env is not necessary if the .aws folder is set up with the default and credentials
// env: {
//     account: '123456789012',
//     region: 'us-east-1'
// }
