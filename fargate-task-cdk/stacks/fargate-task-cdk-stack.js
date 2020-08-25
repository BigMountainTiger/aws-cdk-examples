// https://stackoverflow.com/questions/54524427/running-two-containers-on-fargate-using-cdk

const cdk = require('@aws-cdk/core');
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const ecr = require('@aws-cdk/aws-ecr');
const iam = require('@aws-cdk/aws-iam');

class FargateTaskCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const VPC_NAME = `${id}-VPC`;
    const vpc = new ec2.Vpc(this, VPC_NAME, { maxAZs: 2 });

    const CLUSTER_NAME = `${id}-CLUSTER`;
    const cluster = new ecs.Cluster(this, CLUSTER_NAME, { vpc, clusterName: CLUSTER_NAME });
    

    const TASK_ROLE_NAME = `${id}-TASK-ROLE`;
    const task_role = new iam.Role(this, TASK_ROLE_NAME, {
      roleName: TASK_ROLE_NAME,
      description: TASK_ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    task_role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['s3:GetObject', 's3:PutObject']
    }));

    const FARGATE_NAME = `${id}-FARGATE`;
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(this,
      FARGATE_NAME, {
        memoryMiB: "512",
        cpu: "256",
        taskRole: task_role
    });

    const REPOSITORY_ID = `${id}-REPOSITORY`;
    const REPOSITORY_NAME = `fargate-experiment`;
    const repository = new ecr.Repository(this, REPOSITORY_ID, {
      repositoryName: REPOSITORY_NAME,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    const CONTAINER_NAME = `${id}-CONTAINER`;
    fargateTaskDefinition.addContainer(CONTAINER_NAME, {
        image: ecs.ContainerImage.fromEcrRepository(repository, '1.0.0')
    });

    // const SERVICE_NAME = `${id}-SERVICE`;
    // new ecs.FargateService(this, SERVICE_NAME, {
    //   serviceName: SERVICE_NAME,
    //   cluster,
    //   taskDefinition: fargateTaskDefinition
    // });

  }
}

module.exports = { FargateTaskCdkStack }
