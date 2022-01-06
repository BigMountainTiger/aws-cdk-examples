const cdk = require('aws-cdk-lib');
const ec2 = require('aws-cdk-lib/aws-ec2');
const s3 = require('aws-cdk-lib/aws-s3');
const ecs = require("aws-cdk-lib/aws-ecs");
const ecr = require('aws-cdk-lib/aws-ecr');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const logs = require('aws-cdk-lib/aws-logs');

class FargateTask2022Stack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const bucket = (() => {
      const bucket = new s3.Bucket(this, `${id}-S3-BUCKET`, {
        bucketName: `test.bucket.huge.head.li`,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        versioned: false,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });

      return bucket;
    })();

    const log_group = (() => {
      const NAME = 'FARGATE-TASK-2022';
      return new logs.LogGroup(this, `${id}-${NAME}`, {
        logGroupName: NAME,
        retention: cdk.Duration.days(1).toDays(),
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });
    })();

    // VPC
    const vpc = (() => {
      const NAME = `${id}-VPC`;
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

    // ECS Cluster
    const cluster = (() => {
      const NAME = `${id}-CLUSTER`;
      return new ecs.Cluster(this, NAME, { vpc: vpc, clusterName: NAME });
    })();

    // ECR Repository
    const repository = (() => {
      const REPOSITORY_ID = `${id}-REPOSITORY`;
      const REPOSITORY_NAME = `fargate-experiment`;
      return new ecr.Repository(this, REPOSITORY_ID, {
        repositoryName: REPOSITORY_NAME,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      })
    })();

    // Fargate Task Definition
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
        actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject', 's3:ListBucket']
      }));

      task_role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      const FARGATE_NAME = `${id}-FARGATE`;
      const fargateTaskDefinition = new ecs.FargateTaskDefinition(this,
        FARGATE_NAME, {
        memoryMiB: "512",
        cpu: "256",
        taskRole: task_role
      });

      const CONTAINER_NAME = `${id}-CONTAINER`;
      fargateTaskDefinition.addContainer(CONTAINER_NAME, {
        image: ecs.ContainerImage.fromEcrRepository(repository, '1.0.0'),
      });

      return fargateTaskDefinition;
    })();

    // Launch lambda
    const launch_lambda = (() => {
      const TASK_LAUNCHER_ROLE_NAME = `${id}-TASK-LAUNCHER-LAMBDA_ROLE`;
      const task_launcher_role = new iam.Role(this, TASK_LAUNCHER_ROLE_NAME, {
        roleName: TASK_LAUNCHER_ROLE_NAME,
        description: TASK_LAUNCHER_ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      task_launcher_role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      task_launcher_role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: [
          'ecs:RunTask',
          'iam:PassRole',
          'tag:GetResources',
          'ec2:DescribeSecurityGroups',
          'ec2:DescribeSubnets',
          'ec2:DescribeVpcs'
        ]
      }));

      const TASK_LAUNCHER_LAMBDA_NAME = `${id}-TASK-LAUNCHER`;
      return new lambda.Function(this, TASK_LAUNCHER_LAMBDA_NAME, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: TASK_LAUNCHER_LAMBDA_NAME,
        description: TASK_LAUNCHER_LAMBDA_NAME,
        timeout: cdk.Duration.seconds(15),
        role: task_launcher_role,
        code: lambda.Code.asset('./lambdas/task-launcher'),
        memorySize: 128,
        handler: 'app.lambdaHandler'
      });
    })();


  }
}

module.exports = { FargateTask2022Stack }
