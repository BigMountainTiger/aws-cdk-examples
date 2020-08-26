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
            subnets: ['subnet-039c9e616b3058a7a'],
            securityGroups: ['sg-0aa764a240b688476'],
            assignPublicIp: 'DISABLED'
        }
    }
  };

  const result = await ecs.runTask(params).promise();
  
  return result;
};