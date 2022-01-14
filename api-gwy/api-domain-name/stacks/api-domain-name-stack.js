const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');
const apigateway = require('@aws-cdk/aws-apigateway');
const acm = require('@aws-cdk/aws-certificatemanager');
const route53 = require('@aws-cdk/aws-route53');
require('dotenv').config();

class ApiDomainNameStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const role = (() => {
      const ROLE_NAME = `${id}-LAMBDA-ROLE`;
      const role = new iam.Role(this, ROLE_NAME, {
        roleName: ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      return role;

    })();

    const func = (() => {

      const FUNCTION_NAME = `${id}-domain_name_test_lambda`;
      const path = './lambdas/domain_name_lambda';
      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.PYTHON_3_9,
        role: role,
        functionName: FUNCTION_NAME,
        memorySize: 128,
        timeout: cdk.Duration.seconds(120),
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

      return api;
    })();

    const domain = (() => {
      const DOMAIN_NAME = 'api.bigmountaintiger.com';
      const CERT_ARN = process.env.CERT_ARN;
      const cert = acm.Certificate.fromCertificateArn(this, `${id}-API-CERT`, CERT_ARN);
      const domain = new apigateway.DomainName(this, `${id}-API-DOMAIN`, {
        certificate: cert,
        domainName: DOMAIN_NAME,
        endpointType: apigateway.EndpointType.REGIONAL,
        securityPolicy: apigateway.SecurityPolicy.TLS_1_2
      });

      domain.addBasePathMapping(api, {
        stage: api.deploymentStage
      });

      const HOSTED_ZONE_ID = process.env.HOSTED_ZONE_ID;
      const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, `${id}-HostedZone`, {
        hostedZoneId: HOSTED_ZONE_ID,
        zoneName: 'bigmountaintiger.com'
      });

      const cname = new route53.CnameRecord(this, `${id}-ApiGatewayRecordSet`, {
        zone: hostedZone,
        recordName: DOMAIN_NAME,
        domainName: domain.domainNameAliasDomainName,
        ttl: cdk.Duration.minutes(1)
      });

      cname.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

      return domain;

    })();

  }
}

module.exports = { ApiDomainNameStack }