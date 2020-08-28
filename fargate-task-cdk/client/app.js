const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

class FargateTaskParameterStore {
  constructor(tag) {
    this.tag = tag;
    this.allResources = null;
  }

  async LoadAllResouces() {
    const tag = this.tag;

    const tag_api = new AWS.ResourceGroupsTaggingAPI();
    const resources = await tag_api.getResources({ ResourceTypeFilters: [], TagFilters: [
      { Key: tag.key, Values: [tag.value] } ]}).promise();

    this.allResources = resources.ResourceTagMappingList;
  }

  FilterResourcesByType(type) {
    const result = [];

    const resources = this.allResources;
    const length = resources.length;

    for (let i = 0; i < length; i++) {
      
      // Split by '/' first and then by ':'
      const arn = resources[i].ResourceARN;
      const entries = arn.split('/');
      const resource = { type: entries[0].split(':').pop(), id: entries[1], resource: resources[i] };
      
      if (!type || (resource.type === type)) { result.push(resource); }
    }
  
    return result;
  }

  async getAwsvpcConfiguration() {
    const vpc = this.FilterResourcesByType('vpc')[0];

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
  }

  async GetFargateTaskParameter() {
    await this.LoadAllResouces();

    const awsvpcConfiguration = await this.getAwsvpcConfiguration();
    const cluster = this.FilterResourcesByType('cluster')[0];
    const taskDefinition = this.FilterResourcesByType('task-definition')[0];

    // Subnet needs a NAT, not IGW, unless publicIp is assigned
    // So the fargate can pull the image from the repository
    const params = {
      launchType: 'FARGATE',
      networkConfiguration: { awsvpcConfiguration: awsvpcConfiguration },
      cluster: cluster.id,
      taskDefinition: taskDefinition.id
    };

    return params;
  }
}

(async () => {

  const tag = { key: 'VPC-TAG', value: 'FARGATE-VPC' };
  const store = new FargateTaskParameterStore(tag);
  const params = await store.GetFargateTaskParameter();

  const ecs = new AWS.ECS();
  const result = await ecs.runTask(params).promise();

  console.log(result);
  console.log('Done');
})();

console.log('Started');

