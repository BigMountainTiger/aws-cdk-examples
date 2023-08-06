const cdk = require('aws-cdk-lib');
const ec2 = require('aws-cdk-lib/aws-ec2');
const rds = require('aws-cdk-lib/aws-rds');
const route53 = require('aws-cdk-lib/aws-route53');
const host_zone = require('./hosted-zone');

class RdsPostgresStack extends cdk.Stack {

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
      securityGroupName: SECURITY_GROUP_NAME,
      allowAllOutbound: false
    });

    security_group.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), `${SECURITY_GROUP_NAME}-inbound`);

    const RDS_DATABASE_NAME = `${id}-RDS-DATABASE`;
    const instance = new rds.DatabaseInstance(this, RDS_DATABASE_NAME, {
      databaseName: 'ExperimentDB',
      instanceIdentifier: 'Database-1',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deleteAutomatedBackups: true,
      backupRetention: cdk.Duration.days(0),
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_14 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      allocatedStorage: 20,
      credentials: rds.Credentials.fromPassword('postgres', cdk.SecretValue.unsafePlainText('Password123')),
      vpc: vpc,
      securityGroups: [security_group],
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
    });

    const HOSTED_ZONE_ID = host_zone.HOSTED_ZONE_ID;
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, `${id}-HostedZone`, {
      hostedZoneId: HOSTED_ZONE_ID,
      zoneName: 'bigmountaintiger.com'
    });

    new route53.CnameRecord(this, `${id}-CNAME`, {
      recordName: 'postgres',
      zone: hostedZone,
      domainName: instance.instanceEndpoint.hostname,
      ttl: cdk.Duration.seconds(30)
    });

  }
}

module.exports = { RdsPostgresStack }
