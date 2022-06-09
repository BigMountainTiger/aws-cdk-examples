#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { ApiGwBasicStack } = require('./stacks/api-gw-basic-stack');
const { ApiGwBasicInfrastructureStack } = require('./stacks/api-gw-basic-infrastructure-stack');
const { ApiGwBasicRoute53Stack, load_api_info } = require('./stacks/api-gw-basic-route53-stack');

const app = new cdk.App();
new ApiGwBasicInfrastructureStack(app, 'API-GW-Basic-INFRASTRUCTURE-STACK', {});
new ApiGwBasicStack(app, 'API-GW-Basic-STACK', {});

(async () => {

    const apis = await load_api_info();
    new ApiGwBasicRoute53Stack(app, 'API-GW-Basic-ROUTE53-STACK', {
        apis: apis
    })
})();
