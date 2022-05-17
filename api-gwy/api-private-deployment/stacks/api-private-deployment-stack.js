const cdk = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
const iam = require('aws-cdk-lib/aws-iam');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const ec2 = require('aws-cdk-lib/aws-ec2');

const env = require('../env');
const { VpnConnection } = require('aws-cdk-lib/aws-ec2');

class ApiPrivateDeploymentStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'DEFAULT_VPC', {
      isDefault: true
    });

    // This is a public subnet so I can ssh into it
    const subnet_c = ec2.Subnet.fromSubnetAttributes(this, 'ASubnet', {
      availabilityZone: ' us-east-1c',
      subnetId: env.SUBNET
    });

    const sg = (() => {

      const NAME = 'API-VpcEndpoint'
      const sg = new ec2.SecurityGroup(this, NAME, {
        vpc,
        allowAllOutbound: true,
        securityGroupName: NAME
      });

      sg.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(443));

      return sg;

    })();

    const vpcEndpoint = (() => {

      return new ec2.InterfaceVpcEndpoint(this, 'ApiVpcEndpoint', {
        vpc: vpc,
        service: {
          name: 'com.amazonaws.us-east-1.execute-api',
          port: 443
        },
        subnets: {
          subnets: [subnet_c]
        },
        privateDnsEnabled: true,
        securityGroups: [sg]
      })

    })();

    const NAME = 'LAMBDA-ROLE';
    const role = (() => {
      const role = new iam.Role(this, `${id}-${NAME}`, {
        roleName: NAME,
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

      const NAME = 'EXAMPLE-LAMBDA';
      const func = new lambda.Function(this, `${id}-${NAME}`, {
        runtime: lambda.Runtime.NODEJS_14_X,
        functionName: NAME,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.fromAsset('./lambdas/AFunction'),
        handler: 'index.handler'
      });

      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      })

      return func;

    })();

    const api = (() => {
      const NAME = 'EXAMPLE-API-GW';

      const api = new apigateway.RestApi(this, `${id}-${NAME}`, {
        restApiName: NAME,
        description: NAME,
        endpointTypes: [apigateway.EndpointType.PRIVATE],
        policy: new iam.PolicyDocument(
          {
            statements: [
              new iam.PolicyStatement({
                principals: [new iam.AnyPrincipal],
                actions: ['execute-api:Invoke'],
                resources: ['execute-api:/*'],
                effect: iam.Effect.DENY,
                conditions: {
                  StringNotEquals: {
                    "aws:SourceVpce": vpcEndpoint.vpcEndpointId
                  }
                }
              }),
              new iam.PolicyStatement({
                principals: [new iam.AnyPrincipal],
                actions: ['execute-api:Invoke'],
                resources: ['execute-api:/*'],
                effect: iam.Effect.ALLOW
              })
            ]
          }
        )
      });

      return api;

    })();

    const resource = api.root;
    resource.addMethod('GET', new apigateway.LambdaIntegration(func, { proxy: true }));

    (() => {

      new cdk.CfnOutput(this, 'VPN_CIDR', { value: vpc.vpcCidrBlock });
      new cdk.CfnOutput(this, 'API_ID', { value: api.restApiId });
      new cdk.CfnOutput(this, 'VPC_ENDPOINT_ID', { value: vpcEndpoint.vpcEndpointId });

    })();

  }
}

module.exports = { ApiPrivateDeploymentStack }
