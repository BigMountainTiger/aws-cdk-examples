#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { ElasticsearchExampleStack } = require('./stacks/elasticsearch-example-stack');

const app = new cdk.App();
new ElasticsearchExampleStack(app, 'ElasticsearchExample-STACK', {});
