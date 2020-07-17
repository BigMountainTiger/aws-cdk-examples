#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CodebuildCdkStack } = require('./stacks/codebuild-cdk-stack');
const { CodepipelineCdkStack } = require('./stacks/codepipeline-cdk-stack');

const app = new cdk.App();
const CODEBUILD_CDK_STACK_NAME = 'CODEBUILD-CDK-STACK';
new CodebuildCdkStack(app, CODEBUILD_CDK_STACK_NAME, {
  description: CODEBUILD_CDK_STACK_NAME
});

const CODEPIPELINE_CDK_STACK_NAME = 'CODEPIPELINE-CDK-STACK';
new CodepipelineCdkStack(app, CODEPIPELINE_CDK_STACK_NAME, {
  description: CODEPIPELINE_CDK_STACK_NAME
});