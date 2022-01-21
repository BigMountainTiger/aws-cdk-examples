const cdk = require('aws-cdk-lib');
const efs = require('aws-cdk-lib/aws-efs');
const ec2 = require('aws-cdk-lib/aws-ec2');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const ecr = require('aws-cdk-lib/aws-ecr');
const ecs = require("aws-cdk-lib/aws-ecs");
const logs = require('aws-cdk-lib/aws-logs');
const sfn = require('aws-cdk-lib/aws-stepfunctions');
const sfntasks = require('aws-cdk-lib/aws-stepfunctions-tasks');
const { LoggingLevel } = require('aws-cdk-lib/aws-chatbot');

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
      const sg = new ec2.SecurityGroup(this, `${id}-${NAME}`, { description: NAME, vpc: vpc, allowAllOutbound: true });
      sg.connections.allowFrom(sg, ec2.Port.tcpRange(8786, 8787), 'Internal-SG-8786-8787');
      sg.connections.allowFrom(sg, ec2.Port.tcp(2049), 'Internal-SG-2049');

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
      const cluster = new ecs.Cluster(this, NAME, { vpc: vpc, clusterName: NAME });

      return cluster;
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
            rootDirectory: '/',
            transitEncryption: 'ENABLED',
            authorizationConfig: {
              accessPointId: access_point.accessPointId,
              iam: 'DISABLED'
            }
          },
        }]
      });

      return definition;
    })();

    const container = (() => {
      const NAME = `${id}-CONTAINER`;
      const container = fargateTaskDefinition.addContainer(NAME, {
        image: ecs.ContainerImage.fromEcrRepository(repository, '1.0.0'),
      });

      container.addMountPoints({
        containerPath: '/lambda',
        sourceVolume: 'EFS-VOLUME'
      });

      return container;

    })();

    // Step function
    (() => {

      const sfn_fargate_step = (() => {
        const STEP_NAME = 'EFS-STEP_FARGATE_TASK';
        
        // 1. Cluster
        // 2. Task definition
        // 3. Container - It is needed here, because a task may have more than 1 containers
        // 4. Other - launch type, security group, assign public IP, etc.
        const task = new sfntasks.EcsRunTask(this, STEP_NAME, {
          launchTarget: new sfntasks.EcsFargateLaunchTarget(),
          assignPublicIp: true,
          securityGroups: [sg],
          integrationPattern: sfn.IntegrationPattern.RUN_JOB,
          cluster: cluster,
          taskDefinition: fargateTaskDefinition,
          containerOverrides: [{
            containerDefinition: container
          }]
        });
  
        return task;
  
      })();

      const task_log_group = (() => {
        const NAME = 'STEP-FUNCTION-TASK-LOG';
        return new logs.LogGroup(this, `${id}-${NAME}`, {
          logGroupName: NAME,
          removalPolicy: cdk.RemovalPolicy.DESTROY
        });
      })();

      const definition = sfn_fargate_step;
      const STATE_MACHINE_NAME = 'EFS_TEST_STATE_MACHINE';
      new sfn.StateMachine(this, STATE_MACHINE_NAME, {
        stateMachineName: STATE_MACHINE_NAME,
        definition: definition,
        timeout: cdk.Duration.minutes(10),
        logs: {
          destination: task_log_group,
          includeExecutionData: true,
          level: sfn.LogLevel.ALL
        }
      });
    })();

  }
}

module.exports = { EfsExampleBasicStack }
