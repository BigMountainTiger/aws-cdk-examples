// https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/

// CDK Docker image
// https://docs.aws.amazon.com/cdk/latest/guide/assets.html

// CDK example
// https://docs.aws.amazon.com/cdk/latest/guide/ecs_example.html

const cdk = require('@aws-cdk/core');
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const ecs_patterns = require("@aws-cdk/aws-ecs-patterns");

class DockerCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const VPC_NAME = `${id}-VPC`;
    const vpc = new ec2.Vpc(this, VPC_NAME, { maxAzs: 3 });
    
    const CLUSTER_NAME = `${id}-CLUSTER`;
    const cluster = new ecs.Cluster(this, CLUSTER_NAME, { vpc: vpc });

    const image = ecs.ContainerImage.fromAsset('./docker/express-app');
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
      cluster: cluster,
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: { image: image },
      memoryLimitMiB: 512,
      publicLoadBalancer: true
    });

  }
}

module.exports = { DockerCdkStack }
