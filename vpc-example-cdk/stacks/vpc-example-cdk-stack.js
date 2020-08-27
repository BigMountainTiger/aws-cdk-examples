const cdk = require('@aws-cdk/core');
const ec2 = require("@aws-cdk/aws-ec2");

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

    cdk.Tag.add(vpc, 'VPC-TAG', 'FARGATE-VPC');
    
  }
}

module.exports = { VpcExampleCdkStack }
