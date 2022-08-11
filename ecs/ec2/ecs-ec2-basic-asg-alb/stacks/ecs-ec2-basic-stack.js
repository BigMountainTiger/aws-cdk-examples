const cdk = require('aws-cdk-lib');
const ec2 = require('aws-cdk-lib/aws-ec2');
const ecr = require('aws-cdk-lib/aws-ecr');
const ecs = require('aws-cdk-lib/aws-ecs');
const autoscaling = require('aws-cdk-lib/aws-autoscaling');
const codeguruprofiler = require('aws-cdk-lib/aws-codeguruprofiler');
const iam = require('aws-cdk-lib/aws-iam');
const ecsPatterns = require('aws-cdk-lib/aws-ecs-patterns');
const elbv2 = require("aws-cdk-lib/aws-elasticloadbalancingv2");

const REPOSITORY_NAME = 'ec2-type-example';

class EcsEc2Basic_ecr_Stack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    new ecr.Repository(this, `${id}-${REPOSITORY_NAME}`, {
      repositoryName: REPOSITORY_NAME,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    (() => {
      const NAME = 'EC2-TYPE-VPC';
      new ec2.Vpc(this, NAME, {
        maxAZs: 2,
        vpcName: NAME,
        subnetConfiguration: [{
          name: 'PUBLIC-SUBNET-CONFIG',
          cidrMask: 24,
          subnetType: ec2.SubnetType.PUBLIC
        }]
      });
    })();

  }
}

class EcsEc2BasicStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const codeguru_role = (() => {

      const NAME = 'CODEGURU-TEST-ROLE';
      const role = new iam.Role(this, NAME, {
        roleName: NAME,
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
      });

      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonCodeGuruProfilerAgentAccess'));

      return role;

    })();

    const profilingGroup = (() => {

      const NAME = 'Test';
      const profilingGroup = null;

      // Skip creating the codeguru profiling group
      const create_profiling_group = false;
      if (create_profiling_group) {
        profilingGroup = new codeguruprofiler.ProfilingGroup(this, NAME, {
          profilingGroupName: NAME,
          computePlatform: codeguruprofiler.ComputePlatform.DEFAULT,
        });
      }

      return profilingGroup;

    })();

    const repository = (() => {
      const repository = ecr.Repository.fromRepositoryName(this, `${id}-${REPOSITORY_NAME}`, REPOSITORY_NAME);
      return repository;
    })();

    const vpc = (() => {
      const NAME = 'EC2-TYPE-VPC';
      return ec2.Vpc.fromLookup(this, NAME, { isDefault: false });
    })();

    const cluster = (() => {
      const NAME = `${id}-CLUSTER`;
      return new ecs.Cluster(this, NAME, {
        vpc: vpc,
        clusterName: NAME
      });
    })();

    const constainer_sg = (() => {
      const NAME = 'CONTAINER-SG'
      const sg = new ec2.SecurityGroup(this, NAME, {
        securityGroupName: NAME,
        vpc: vpc,
      });

      sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8000));
      sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

      return sg;

    })();

    const asg = (() => {

      const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
        vpc: vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        securityGroup: constainer_sg,
        newInstancesProtectedFromScaleIn: false,
        minCapacity: 1,
        maxCapacity: 2,
      });

      // Testing scale on schedule
      new autoscaling.ScheduledAction(this, 'MyScheduledAction', {
        autoScalingGroup: asg,
        schedule: autoscaling.Schedule.cron({ hour: '13', minute: '55' }),
        minCapacity: 1,
        maxCapacity: 2,
        desiredCapacity: 2,
        timeZone: 'America/New_York'
      });

      return asg;

    })();

    const capacityProvider = (() => {

      // A "Target tracking scaling" policy is automatically added by CDK if "enableManagedScaling" enabled
      const capacityProvider = new ecs.AsgCapacityProvider(this, 'AsgCapacityProvider', {
        capacityProviderName: 'AsgCapacityProvider',
        autoScalingGroup: asg,
        enableManagedScaling: false,
        enableManagedTerminationProtection: false
      });

      cluster.addAsgCapacityProvider(capacityProvider);

      return capacityProvider;

    })();

    const taskDefinition = (() => {

      const NAME = 'EC2_TASK_DEFINITION';
      const taskDefinition = new ecs.Ec2TaskDefinition(this, NAME, {
        family: NAME,
        taskRole: codeguru_role,
      });

      taskDefinition.addContainer(`${id}-CONTAINER`, {
        image: ecs.ContainerImage.fromEcrRepository(repository, '1.0.0'),
        portMappings: [{
          containerPort: 8000,
          hostPort: 8000
        }],
        memoryLimitMiB: 256
      });

      return taskDefinition;

    })();

    const service = (() => {

      // Use daemon stratage to deploy container to all the instances in the capacity provider.
      // Leave the scaling to the auto-scaling group
      const NAME = `${id}-SERVICE`
      const service = new ecs.Ec2Service(this, NAME, {
        cluster: cluster,
        taskDefinition: taskDefinition,
        daemon: true,
      });

      return service;

    })();


    (() => {

      const NAME = 'ECS-Sercice-LB';
      const lb = new elbv2.ApplicationLoadBalancer(this, NAME, { vpc: vpc, internetFacing: true, securityGroup: constainer_sg });

      const tg = new elbv2.ApplicationTargetGroup(this, 'TG', {
        port: 8000,
        vpc: vpc,
        targets: [asg]
      });

      // A security group will be added by CDK to allow incoming 80
      const listener = lb.addListener('Listener', { port: 80 });

      listener.addAction('FORWARD', {
        action: elbv2.ListenerAction.forward([tg])
      });

    })();




  }
}

module.exports = { EcsEc2Basic_ecr_Stack, EcsEc2BasicStack }
