#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { EksBasicExampleStack } = require('./stacks/eks-basic-example-stack');

const app = new cdk.App();
new EksBasicExampleStack(app, 'EKS-Basic-Example-STACK', {});
