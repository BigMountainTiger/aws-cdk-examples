const cdk = require('aws-cdk-lib');
const ec2 = require('aws-cdk-lib/aws-ec2');
const ecr = require('aws-cdk-lib/aws-ecr');
const ecs = require("aws-cdk-lib/aws-ecs");
const elbv2 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const application_autoscaling = require('aws-cdk-lib/aws-applicationautoscaling');

const REPOSITORY_NAME = `fargate-alb-experiment`;

// Create the ECR first in a separate stack
class FargateAlbExample_ecr_Stack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    new ecr.Repository(this, `${id}-${REPOSITORY_NAME}`, {
      repositoryName: REPOSITORY_NAME,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

  }
}

// The stack to use the ECR to deploy the containers
class FargateAlbExampleStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const repository = ecr.Repository.fromRepositoryName(this, `${id}-${REPOSITORY_NAME}`, REPOSITORY_NAME);

    const vpc = (() => {
      const NAME = 'fargate-alb-experiment';
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

    const constainer_sg = (() => {
      const NAME = 'CONTAINER-SG'
      const sg = new ec2.SecurityGroup(this, 'NAME', {
        securityGroupName: NAME,
        vpc: vpc,
      });

      sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8080));

      return sg;

    })();

    const cluster = (() => {
      const NAME = `${id}-CLUSTER`;
      return new ecs.Cluster(this, NAME, {
        vpc: vpc,
        clusterName: NAME
      });
    })();

    const fargateTaskDefinition = (() => {

      const FARGATE_NAME = `${id}-FARGATE`;
      const fargateTaskDefinition = new ecs.FargateTaskDefinition(this,
        FARGATE_NAME, {
        memoryMiB: "512",
        cpu: "256"
      });

      const CONTAINER_NAME = `${id}-CONTAINER`;
      fargateTaskDefinition.addContainer(CONTAINER_NAME, {
        image: ecs.ContainerImage.fromEcrRepository(repository, '1.0.0'),
        containerName: CONTAINER_NAME,
        portMappings: [{
          containerPort: 8080,
          hostPort: 8080
        }]
      });

      return fargateTaskDefinition;
    })();

    const service = (() => {

      const NAME = `${id}-SERVICE`
      const service = new ecs.FargateService(this, NAME, {
        cluster: cluster,
        serviceName: NAME,
        taskDefinition: fargateTaskDefinition,
        assignPublicIp: true,
        desiredCount: 1,
        securityGroups: [constainer_sg]
      });

      const fas = service.autoScaleTaskCount({
        minCapacity: 1,
        maxCapacity: 3
      });

      // Test to scale fargate service by schedule
      // fas.scaleOnSchedule('TEST-SCHEDULE', {
      //   schedule: application_autoscaling.Schedule.cron({ hour: '13', minute: '50' }),
      //   minCapacity: 2,
      //   maxCapacity: 3
      // });

      return service;
    })();

    (() => {

      const NAME = 'FARGATE-LB';
      const lb = new elbv2.ApplicationLoadBalancer(this, NAME, { vpc: vpc, internetFacing: true });

      // A security group will be added by CDK to allow incoming 80
      const listener = lb.addListener('Listener', { port: 80 });
      const tg = new elbv2.ApplicationTargetGroup(this, 'TG', {
        targetType: elbv2.TargetType.IP, port: 8080, vpc: vpc,
        targets: [ service ]
      });

      listener.addAction('FORWARD', {
        action: elbv2.ListenerAction.forward([tg])
      });

    })();

  }
}

module.exports = { FargateAlbExample_ecr_Stack, FargateAlbExampleStack }
