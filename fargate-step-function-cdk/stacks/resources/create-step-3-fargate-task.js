const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const ecr = require('@aws-cdk/aws-ecr');
const sfn = require('@aws-cdk/aws-stepfunctions');
const tasks = require('@aws-cdk/aws-stepfunctions-tasks');

const create_step_3_fargate_task = (scope) => {

  const cluster = create_cluster(scope);
  const fargate_definition = create_fargate_task_definition(scope);

  const STEP_NAME = 'STEP_TEST_FARGATE_TASK';

  const task = new tasks.EcsRunTask(scope, STEP_NAME, {
    launchTarget: new tasks.EcsFargateLaunchTarget(),
    assignPublicIp: true,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    cluster: cluster,
    taskDefinition: fargate_definition
  });

  return task;
  // return new sfn.Wait(scope, STEP_NAME, {
  //   time: sfn.WaitTime.duration(cdk.Duration.seconds(3))
  // });
};

const create_cluster = (scope) => {
  const VPC_NAME = 'STEP_TEST_FARGATE-VPC';
  const vpc = new ec2.Vpc(scope, VPC_NAME, {
    maxAZs: 2,
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: 'TEP_TEST_FARGATE_PUBLIC-SUBNET-CONFIG',
        subnetType: ec2.SubnetType.PUBLIC
      }
    ]
  });

  const CLUSTER_NAME = `STEP_TEST_FARGATE-CLUSTER`;
  const cluster = new ecs.Cluster(scope, CLUSTER_NAME, { vpc, clusterName: CLUSTER_NAME });

  return cluster;
};

const create_fargate_task_definition = (scope) => {

  const FARGATE_NAME = `STEP_TEST_FARGATE-FARGATE-DEFINITION`;
  const fargateTaskDefinition = new ecs.FargateTaskDefinition(scope,
    FARGATE_NAME, {
      memoryMiB: "512",
      cpu: "256"
  });

  const REPOSITORY_ID = `STEP_TEST_FARGATE-REPOSITORY`;
  const REPOSITORY_NAME = `fargate-experiment`;
  const repository = new ecr.Repository(scope, REPOSITORY_ID, {
    repositoryName: REPOSITORY_NAME,
    removalPolicy: cdk.RemovalPolicy.DESTROY
  })

  const CONTAINER_NAME = `STEP_TEST_FARGATE-CONTAINER`;
  fargateTaskDefinition.addContainer(CONTAINER_NAME, {
      image: ecs.ContainerImage.fromEcrRepository(repository, '1.0.0')
  });

  const policy = new iam.PolicyStatement();
  policy.addAllResources();
  policy.addActions(['s3:*']);
  fargateTaskDefinition.addToTaskRolePolicy(policy);

  return fargateTaskDefinition;
};

module.exports = create_step_3_fargate_task;