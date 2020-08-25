const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

(async () => {
  const ecs = new AWS.ECS();

  // Subnet needs a NAT, not IGW, unless publicIp is assigned
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

  console.log(result);
  console.log('Done');
})();

console.log('Started');

