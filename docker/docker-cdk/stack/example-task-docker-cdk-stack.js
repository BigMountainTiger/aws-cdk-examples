// https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/

// CDK Docker image
// https://docs.aws.amazon.com/cdk/latest/guide/assets.html

// CDK Docker container
// https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ecs.ContainerDefinition.html

// CDK example
// https://docs.aws.amazon.com/cdk/latest/guide/ecs_example.html

// Additional
// https://blog.kylegalbraith.com/2019/10/24/how-to-run-docker-containers-via-aws-elastic-container-service/

const cdk = require('@aws-cdk/core');
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const sfn = require('@aws-cdk/aws-stepfunctions');
const tasks = require('@aws-cdk/aws-stepfunctions-tasks');

class ExampleTaskDockerCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const VPC_NAME = `${id}-VPC`;
    const vpc = new ec2.Vpc(this, VPC_NAME, { maxAzs: 3 });
    
    const CLUSTER_NAME = `${id}-CLUSTER`;
    const cluster = new ecs.Cluster(this, CLUSTER_NAME, { vpc: vpc });

    // const image = ecs.ContainerImage.fromAsset('./docker/experiment-1');
    // const CONTAINER_NAME = `${id}-CONTAINER`;
    // const container = new ecs.ContainerDefinition(this. CONTAINER_NAME, {
    // });

    const STEP1_NAME = `${id}-STEP-1`;
    const asset_Path = './docker/experiment-1';
    const image = tasks.DockerImage.fromAsset(this, STEP1_NAME, {
      directory: asset_Path
    });

    // const step_1 = new tasks.RunEcsFargateTask({
    //   cluster: cluster,
    // });
    
    // const definition = image;

    // const STATE_MACHINE_NAME = `${id}-STEP-TEST-STATE-MACHINE`;
    // new sfn.StateMachine(this, STATE_MACHINE_NAME, {
    //   stateMachineName: STATE_MACHINE_NAME,
    //   definition,
    //   timeout: cdk.Duration.minutes(5)
    // });
    
  }
}

module.exports = { ExampleTaskDockerCdkStack }
