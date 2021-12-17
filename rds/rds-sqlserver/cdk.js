#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { RdsSqlserverStack } = require('./stacks/rds-sqlserver-stack');

const app = new cdk.App();
new RdsSqlserverStack(app, 'RdsSqlserverStack', {});
// new RdsSqlserverStack(app, 'RdsSqlserverStack', {
//   env: {
//     account:'660079349745',
//     region:'us-east-1'
//   }
// });