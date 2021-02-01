const cdk = require('@aws-cdk/core');
const ec2 = require("@aws-cdk/aws-ec2");
const rds = require('@aws-cdk/aws-rds');

class RdsPostgresCdkStack extends cdk.Stack {

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
      ]
    });

    const SECURITY_GROUP_NAME = `${id}-VPC-SECURITY-GROUP`;
    const security_group = new ec2.SecurityGroup(this, SECURITY_GROUP_NAME, {
      vpc: vpc,
      securityGroupName:SECURITY_GROUP_NAME,
      allowAllOutbound: false
    });

    security_group.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), `${SECURITY_GROUP_NAME}-inbound`);

    const RDS_DATABASE_NAME = `${id}-RDS-DATABASE`;
    const instance = new rds.DatabaseInstance(this, RDS_DATABASE_NAME, {
      databaseName: 'StudentDB',
      instanceIdentifier: 'Database-1',
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_12_4}),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      credentials: rds.Credentials.fromPassword('postgres', cdk.SecretValue.plainText('Password123')),
      vpc: vpc,
      securityGroups: [security_group],
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
    });

  }
}

module.exports = { RdsPostgresCdkStack }
