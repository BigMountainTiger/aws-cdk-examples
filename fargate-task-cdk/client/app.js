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

  async GetFargateTaskParameter(payload) {
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
      taskDefinition: taskDefinition.id,
      overrides: {
        containerOverrides: [
          {
            name: 'FARGATE-TASK-CDK-STACK-CONTAINER',
            environment: [
              {
                name: 'JSONDATA',
                value: payload
              }
            ]
          }
        ]
      }
    };

    return params;
  }
}

(async () => {

  const tag = { key: 'VPC-TAG', value: 'FARGATE-VPC' };
  const store = new FargateTaskParameterStore(tag);

  const items = [
    {
      'quantity': 12,
      'description': 'Item description No.0',
      'unitprice': 12000.3,
      'linetotal': 20
    }
  ];

  for (let x = 0; x < 50; x++) {
    items.push({
      'quantity': 1290,
      'description': `Item description No.${x}`,
      'unitprice': 12.3,
      'linetotal': 20000
    });
  }

  const data = {
    'items': items,
    'total': 50000000.01
  };

  const str_data = JSON.stringify(data);
  const params = await store.GetFargateTaskParameter(str_data);

  const ecs = new AWS.ECS();
  let result = null;
  
  try {
    result = await ecs.runTask(params).promise();
  }
  catch(e) {
    console.log(e);
  }

  console.log(result);
  console.log('Done');
})();

console.log('Started');

