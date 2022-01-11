const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

exports.lambdaHandler = async (event, context) => {

  const awsvpcConfiguration = {
    subnets: ['subnet-0a174d6e48ea6192b', 'subnet-047f066763ed0c5c9'],
    securityGroups: ['sg-00766e405f575fdf4'],
    assignPublicIp: 'ENABLED'
  }

  const params = {
    launchType: 'FARGATE',
    networkConfiguration: { awsvpcConfiguration: awsvpcConfiguration },
    cluster: 'FargateTask2022Stack-CLUSTER',
    taskDefinition: 'FargateTask2022StackFargateTask2022StackFARGATE8CED21C8'
  };

  const ecs = new AWS.ECS();
  const result = await ecs.runTask(params).promise();

  
  return result;
};