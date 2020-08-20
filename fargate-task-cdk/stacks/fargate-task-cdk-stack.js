// https://stackoverflow.com/questions/54524427/running-two-containers-on-fargate-using-cdk

const cdk = require('@aws-cdk/core');
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");

class FargateTaskCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const VPC_NAME = `${id}-VPC`;
    const vpc = new ec2.Vpc(this, VPC_NAME, { maxAZs: 2 });

    const CLUSTER_NAME = `${id}-CLUSTER`;
    const cluster = new ecs.Cluster(this, CLUSTER_NAME, { vpc });
    
    const FARGATE_NAME = `${id}-FARGATE`;
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(this,
      FARGATE_NAME, {
        memoryMiB: "512",
        cpu: "256"
    });

    const CONTAINER_NAME = `${id}-CONTAINER`;
    fargateTaskDefinition.addContainer(CONTAINER_NAME, {
        image: ecs.ContainerImage.fromAsset('./docker/experiment-1')
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
