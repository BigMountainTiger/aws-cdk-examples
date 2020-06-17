// https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/
// https://docs.aws.amazon.com/cdk/latest/guide/assets.html

const cdk = require('@aws-cdk/core');
const ecs = require('@aws-cdk/aws-ecs');

class DockerCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const TASK_DEFINITION_NAME = `${id}-TASK-DEFINITION`;
    const taskDefinition = new ecs.FargateTaskDefinition(this, TASK_DEFINITION_NAME, {
      memoryLimitMiB: 1024,
      cpu: 512
    });

    const CONTAINER_NAME = `${TASK_DEFINITION_NAME}-CONTAINER`;
    taskDefinition.addContainer(CONTAINER_NAME, {
      image: ecs.ContainerImage.fromAsset('./docker/express-app')
    });
    
  }
}

module.exports = { DockerCdkStack }
