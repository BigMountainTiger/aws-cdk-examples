const cdk = require('@aws-cdk/core');
const ec2 = require("@aws-cdk/aws-ec2");
const rds = require('@aws-cdk/aws-rds');

const createDB = (context, id, props) => {
  const VPC_NAME = `${id}-VPC`;

  // Use the default VPC
  const vpc = ec2.Vpc.fromLookup(context, VPC_NAME, {
    isDefault: true
  });

  const SECURITY_GROUP_NAME = `${id}-VPC-SECURITY-GROUP`;
  const security_group = new ec2.SecurityGroup(context, SECURITY_GROUP_NAME, {
    vpc: vpc,
    securityGroupName:SECURITY_GROUP_NAME,
    allowAllOutbound: false
  });

  security_group.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(1433), `${SECURITY_GROUP_NAME}-inbound`);

  const RDS_DATABASE_NAME = `${id}-RDS-DATABASE`;
  const instance = new rds.DatabaseInstance(context, RDS_DATABASE_NAME, {
    instanceIdentifier: 'Database-1',
    // databaseName: 'Student',
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    deleteAutomatedBackups: true,
    backupRetention: cdk.Duration.days(1),
    engine: rds.DatabaseInstanceEngine.sqlServerEx( { version: rds.SqlServerEngineVersion.VER_12 }),
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
    allocatedStorage: 20,
    credentials: rds.Credentials.fromPassword('sqluser', cdk.SecretValue.plainText('Password123')),
    vpc: vpc,
    securityGroups: [security_group],
    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
  });

}

exports.createDB = createDB;