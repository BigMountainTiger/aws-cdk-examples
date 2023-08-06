#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { RdsPostgresStack } = require('./lib/rds-postgres-stack');

const app = new cdk.App();
new RdsPostgresStack(app, 'RdsPostgresStack', {});
