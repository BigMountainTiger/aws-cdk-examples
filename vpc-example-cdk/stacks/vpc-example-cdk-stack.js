const cdk = require('@aws-cdk/core');
const ec2 = require("@aws-cdk/aws-ec2");

class VpcExampleCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const VPC_NAME = `${id}-VPC`;
    const vpc = new ec2.Vpc(this, VPC_NAME, {
      maxAZs: 1,
      natGateways: 1,
      vpnGateway: false
    });

  }
}

module.exports = { VpcExampleCdkStack }
