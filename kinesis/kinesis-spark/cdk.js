#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { KinesisSparkStack } = require('./stacks/kinesis-spark-stack');

const app = new cdk.App();
new KinesisSparkStack(app, 'KINESIS-Spark-STACK', {});
