#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { GolangExampleStack } = require('./stacks/golang-example-stack');

const app = new cdk.App();
new GolangExampleStack(app, 'GOLANG-Example-Stack', {});
