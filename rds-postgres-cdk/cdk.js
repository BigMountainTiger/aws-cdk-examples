#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { RdsPostgresCdkStack } = require('./stack/rds-postgres-cdk-stack');

const app = new cdk.App();
const NAME = 'RDS-Postgres-Cdk-STACK';
new RdsPostgresCdkStack(app, NAME);
