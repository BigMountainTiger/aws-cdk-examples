#!/usr/bin/env node

const env = require('./env');
const cdk = require('aws-cdk-lib');
const { ApiPrivateDeploymentStack } = require('./stacks/api-private-deployment-stack');

const app = new cdk.App();

new ApiPrivateDeploymentStack(app, 'API-PRIVATE-Deployment-STACK', {
    env: {
        account: env.ACCOUNT,
        region: env.REGION
    }
});
