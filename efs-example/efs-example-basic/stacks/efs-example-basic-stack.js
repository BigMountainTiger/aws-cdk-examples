const cdk = require('aws-cdk-lib');
const efs = require('aws-cdk-lib/aws-efs');
const ec2 = require('aws-cdk-lib/aws-ec2');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const ecr = require('aws-cdk-lib/aws-ecr');
const ecs = require("aws-cdk-lib/aws-ecs");
const logs = require('aws-cdk-lib/aws-logs');

class EfsExampleBasicStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const log_group = (() => {
      const NAME = 'EFS-FARGATE-TASK-LOG';
      return new logs.LogGroup(this, `${id}-${NAME}`, {
        logGroupName: NAME,
        retention: cdk.Duration.days(1).toDays(),
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });
    })();

    const vpc = (() => {
      const NAME = 'DEFAULT-VPC';
      return new ec2.Vpc(this, NAME, {
        maxAZs: 2,
        vpcName: NAME,
        subnetConfiguration: [{
          name: 'PUBLIC-SUBNET-CONFIG',
          cidrMask: 24,
          subnetType: ec2.SubnetType.PUBLIC
        }]
      });
    })();

    const sg = (() => {
      const NAME = 'EFS-SG';
      const sg = new ec2.SecurityGroup(this, `${id}-${NAME}`, { description: NAME, vpc: vpc })
      // sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcpRange(8786, 8787), 'AnyWhere');
      // Add permission to the same security-group is sufficient to provide access to a lambda (with the same security group)
      sg.connections.allowFrom(sg, ec2.Port.tcp(2049), 'Internal-SG');

      return sg;
    })();

    const fs = (() => {

      const NAME = `${id}-TEST-EFS`;
      return new efs.FileSystem(this, NAME, {
        fileSystemName: NAME,
        vpc: vpc,
        securityGroup: sg,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });
    })();

    const access_point = (() => {
      const NAME = 'TEST-Access-point';
      const uid = '1001';
      return fs.addAccessPoint(`${id}-${NAME}`, {
        posixUser: { uid: uid, gid: uid },
        createAcl: { ownerUid: uid, ownerGid: uid, permissions: '0777' },
        path: '/lambda'
      });
    })();

    const create_lambda_role = (name, actions) => {
      const role_name = `${id}_${name}`;
      const principal = new iam.ServicePrincipal('lambda.amazonaws.com');
      const role = new iam.Role(this, role_name, { roleName: role_name, description: role_name, assumedBy: principal });
      role.addToPolicy(new iam.PolicyStatement({ effect: iam.Effect.ALLOW, resources: ['*'], actions: actions }));

      return role;
    };

    const create_lambda = (name, path, role) => {
      const lambda_name = `${id}_${name}`;

      return new lambda.Function(this, lambda_name, {
        runtime: lambda.Runtime.NODEJS_14_X,
        functionName: lambda_name,
        description: lambda_name,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.asset(path),
        memorySize: 128,
        handler: 'app.lambdaHandler',
        vpc: vpc,
        securityGroups: [sg],
        allowPublicSubnet: true,
        filesystem: lambda.FileSystem.fromEfsAccessPoint(access_point, '/mnt/fs')
      });
    };

    const lambda_role = create_lambda_role('LAMBDA_ROLE', [
      'logs:CreateLogGroup',
      'logs:CreateLogStream',
      'logs:PutLogEvents',
      'ec2:DescribeNetworkInterfaces',
      'ec2:CreateNetworkInterface',
      'ec2:DeleteNetworkInterface',
      'ec2:DescribeInstances',
      'ec2:AttachNetworkInterface'
    ]);

    // Access EFS from lambda
    create_lambda('EFS-TEST-lambda', './lambdas/efs-test-lambda', lambda_role);

    // Access EFS from fargate
    const repository = (() => {
      const REPOSITORY_ID = `${id}-REPOSITORY`;
      const REPOSITORY_NAME = `efs-experiment`;
      return new ecr.Repository(this, REPOSITORY_ID, {
        repositoryName: REPOSITORY_NAME,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      })
    })();

    const cluster = (() => {
      const NAME = `${id}-CLUSTER`;
      return new ecs.Cluster(this, NAME, { vpc: vpc, clusterName: NAME });
    })();

    const fargateTaskDefinition = (() => {
      const TASK_ROLE_NAME = `${id}-TASK-ROLE`;
      const task_role = new iam.Role(this, TASK_ROLE_NAME, {
        roleName: TASK_ROLE_NAME,
        description: TASK_ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });

      task_role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      const NAME = `${id}-FARGATE-TASK-DEFINITION`;
      const definition = new ecs.FargateTaskDefinition(this,
        NAME, {
        memoryMiB: "512",
        cpu: "256",
        taskRole: task_role,
        volumes: [{
          name: 'EFS-VOLUME',
          efsVolumeConfiguration: {
            fileSystemId: fs.fileSystemId,
            rootDirectory: '/lambda'
          }
        }]
      });

      return definition;
    })();

    (() => {
      const NAME = `${id}-CONTAINER`;
      const container = fargateTaskDefinition.addContainer(NAME, {
        image: ecs.ContainerImage.fromEcrRepository(repository, '1.0.0'),
      });

      container.addMountPoints({
        containerPath: '/lambda',
        sourceVolume: 'EFS-VOLUME'
      });

    })();

  }
}

module.exports = { EfsExampleBasicStack }
