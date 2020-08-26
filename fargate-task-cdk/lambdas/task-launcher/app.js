const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

exports.lambdaHandler = async (event, context) => {

  const ecs = new AWS.ECS();

  const params = {
    taskDefinition: 'FARGATETASKCDKSTACKFARGATETASKCDKSTACKFARGATE5599BAAB',
    cluster: 'FARGATE-TASK-CDK-STACK-CLUSTER',
    launchType: 'FARGATE',
    networkConfiguration: {
        awsvpcConfiguration: {
            subnets: ['subnet-0ca6298b7ebe790a8'],
            securityGroups: ['sg-00bfe081c5db3a3ed'],
            assignPublicIp: 'DISABLED'
        }
    }
  };

  const result = await ecs.runTask(params).promise();
  
  return {result};
};