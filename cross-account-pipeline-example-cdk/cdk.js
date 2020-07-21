#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CrossAccountPipelineStack } = require('./stacks/cross-account-pipeline-stack');
const { CrossAccountPipelineExampleStack } = require('./stacks/cross-account-pipeline-example-stack');
const { HugeHeadLiCFBucketStack } = require('./stacks/huge-head-li-cf-bucket');

const app = new cdk.App();

const PIPELINE_STACK_NAME = 'CROSS-ACCOUNT-PIPELINE-STACK';
new CrossAccountPipelineStack(app, PIPELINE_STACK_NAME, {
  description: PIPELINE_STACK_NAME
});

const CORE_STACK_NAME = 'CROSS-ACCOUNT-PIPELINE-EXAMPLE-STACK';
new CrossAccountPipelineExampleStack(app, CORE_STACK_NAME, {
  description: CORE_STACK_NAME
});

const HUGE_HEAD_LI_CF_BUCKET_STACK = 'HUGE-HEAD-LI-CF-BUCKET-STACK';
new HugeHeadLiCFBucketStack(app, HUGE_HEAD_LI_CF_BUCKET_STACK, {
  description: HUGE_HEAD_LI_CF_BUCKET_STACK
});