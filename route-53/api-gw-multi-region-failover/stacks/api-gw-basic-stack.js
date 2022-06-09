const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const acm = require('aws-cdk-lib/aws-certificatemanager');
const CONST = require('./CONST');
require('dotenv').config();

class ApiGwBasicStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const tagResource = (resource) => {
      const tag = { key: 'RESOURCE-GROUP', value: 'ROUTE53-API' };
      cdk.Tags.of(resource).add(tag.key, tag.value);
    };

    const role = (() => {

      const ROLE_NAME = CONST.LAMBDA_ROLE_NAME;
      const role = iam.Role.fromRoleName(this, ROLE_NAME, ROLE_NAME);

      return role;

    })();

    const func = (() => {

      const FUNCTION_NAME = `${id}-Example-Lmabda`;
      const path = './lambdas/example_lambda';
      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.PYTHON_3_9,
        role: role,
        functionName: FUNCTION_NAME,
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        code: lambda.Code.fromAsset(path),
        handler: 'app.lambdaHandler'
      });

      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      });

      return func;
    })();

    const api = (() => {

      const API_NAME = `${id}-API`;
      const api = new apigateway.RestApi(this, API_NAME, {
        restApiName: API_NAME,
        description: API_NAME,
        endpointTypes: [apigateway.EndpointType.REGIONAL]
      });

      let r = api.root.addResource('get');
      r.addMethod('GET', new apigateway.LambdaIntegration(func, { proxy: true }));

      tagResource(api);

      return api;
    })();

    const domain = (() => {


      let CERT_ARN = process.env.CERT_ARN_US_EAST_1;
      const REGION = process.env.AWS_DEFAULT_REGION;

      if (REGION == 'us-east-2') {
        CERT_ARN = process.env.CERT_ARN_US_EAST_2;
      }

      const cert = acm.Certificate.fromCertificateArn(this, `${id}-API-CERT`, CERT_ARN);

      const domain = new apigateway.DomainName(this, `${id}-API-DOMAIN`, {
        certificate: cert,
        domainName: 'www.bigmountaintiger.com',
        endpointType: apigateway.EndpointType.REGIONAL,
        securityPolicy: apigateway.SecurityPolicy.TLS_1_2
      });

      domain.addBasePathMapping(api, {
        stage: api.deploymentStage
      });

      tagResource(domain);
      
      return domain;

    })();

    new cdk.CfnOutput(this, 'restApiId', { value: api.restApiId });
    new cdk.CfnOutput(this, 'stageName', { value: api.deploymentStage.stageName });
    new cdk.CfnOutput(this, 'domainNameAliasDomainName', { value: domain.domainNameAliasDomainName });
  }
}

module.exports = { ApiGwBasicStack }
