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

    const SG_NAME = `${id}-SG`;
    const sg = new ec2.SecurityGroup(this, SG_NAME, {
      name: SG_NAME,
      description: SG_NAME,
      vpc: vpc,
      allowAllOutbound: true,
    })

    vpc.publicSubnets.forEach(subnet => {
      cdk.Tag.add(subnet, 'MY-TAG', 'This is a bullshit subnet');
    });

    cdk.Tag.add(sg, 'MY-TAG', 'This is a bullshit SG');
  }
}

module.exports = { VpcExampleCdkStack }
