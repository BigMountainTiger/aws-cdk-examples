const cdk = require('@aws-cdk/core');
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

class VpcExampleCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const VPC_NAME = `${id}-VPC`;
    const vpc = new ec2.Vpc(this, VPC_NAME, {
      maxAZs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PUBLIC-SUBNET-CONFIG',
          subnetType: ec2.SubnetType.PUBLIC
        }
      ],
    });

    //cdk.Tag.add(vpc, 'VPC-TAG', 'FARGATE-VPC');
    cdk.Tags.of(vpc).add('VPC-TAG', 'FARGATE-VPC');

    const ROLE_NAME = `${id}-LAMBDA_ROLE`;
    const role = new iam.Role(this, ROLE_NAME, {
      roleName: ROLE_NAME,
      description: ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'tag:GetResources',
        'ec2:DescribeSecurityGroups',
        'ec2:DescribeSubnets',
        'ec2:DescribeVpcs'
      ]
    }));

    const LAMBDA_NAME = `${id}-TAG-QUERY`;
    new lambda.Function(this, LAMBDA_NAME, {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: LAMBDA_NAME,
      description: LAMBDA_NAME,
      timeout: cdk.Duration.seconds(15),
      role: role,
      code: lambda.Code.asset('./lambdas/tag-query'),
      memorySize: 256,
      handler: 'app.lambdaHandler'
    });
    
  }
}

module.exports = { VpcExampleCdkStack }
