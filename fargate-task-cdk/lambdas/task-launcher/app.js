const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

const getResourcesByTag = async (tag, type) => {

  const filterResourcesByType = (resources) => {
    const result = [];
  
    const length = resources.length;
    for (let i = 0; i < length; i++) {

      // Split by '/' first and then by ':'
      const arn = resources[i].ResourceARN;
      const entries = arn.split('/');
      const resource = { type: entries[0].split(':').pop(), id: entries[1], resource: resources[i] };

      if (!type || (resource.type === type)) { result.push(resource); }
    }
  
    return result;
  };

  const tag_api = new AWS.ResourceGroupsTaggingAPI();
  const resources = await tag_api.getResources({ ResourceTypeFilters: [], TagFilters: [ { Key: tag.key, Values: [tag.value] } ]}).promise();

  return filterResourcesByType(resources.ResourceTagMappingList || []);
};

const getAwsvpcConfiguration = async (tag) => {

  const vpc = (await getResourcesByTag(tag, 'vpc'))[0];

  const ec2 = new AWS.EC2();
  const filters = [ { Name: 'vpc-id', Values: [vpc.id] } ];
  const subnets = await ec2.describeSubnets({ Filters: filters }).promise();
  const security_groups = await ec2.describeSecurityGroups({ Filters: filters }).promise();

  const subnet_ids = [];
  subnets.Subnets.forEach(item => { subnet_ids.push(item.SubnetId); });

  const sg_ids = [];
  security_groups.SecurityGroups.forEach(item => { sg_ids.push(item.GroupId); });

  const awsvpcConfiguration = {
    subnets: subnet_ids,
    securityGroups: sg_ids,
    assignPublicIp: 'ENABLED'
  }

  return awsvpcConfiguration;
};

exports.lambdaHandler = async (event, context) => {

  const tag = { key: 'VPC-TAG', value: 'FARGATE-VPC' };

  const awsvpcConfiguration = await getAwsvpcConfiguration(tag);
  const cluster = (await getResourcesByTag(tag, 'cluster'))[0];
  const taskDefinition = (await getResourcesByTag(tag, 'task-definition'))[0];

  // Subnet needs a NAT, not IGW, unless publicIp is assigned
  // So the fargate can pull the image from the repository
  const params = {
    taskDefinition: taskDefinition.id,
    cluster: cluster.id,
    launchType: 'FARGATE',
    networkConfiguration: { awsvpcConfiguration: awsvpcConfiguration }
  };

  const ecs = new AWS.ECS();
  const result = await ecs.runTask(params).promise();
  
  return result;
};