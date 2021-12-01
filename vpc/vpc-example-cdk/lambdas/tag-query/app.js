const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

const getAwsvpcConfiguration = async (vpc_tag) => {

  const getResourcesByTag = async (tag, type) => {

    const filterResourcesByType = (resources) => {
      const result = [];
    
      const length = resources.length;
      for (let i = 0; i < length; i++) {
        const arn = resources[i].ResourceARN;
        const last_entry = arn.split(':').pop();
        const items = last_entry.split('/');
    
        const resource = { type: items[0], id: items[1], arn: arn };
    
        if (resource.type === type) { result.push(resource); }
      }
    
      return result;
    };
  
    const tag_api = new AWS.ResourceGroupsTaggingAPI();
    const resources = await tag_api.getResources({
      ResourceTypeFilters: [],
      TagFilters: [ { Key: tag.key, Values: [tag.value] } ]
    }).promise();
  
    return filterResourcesByType(resources.ResourceTagMappingList || []);
  };

  const vpc = (await getResourcesByTag(vpc_tag, 'vpc'))[0];

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

exports.lambdaHandler = async (event, context) => {
  const tag = { key: 'VPC-TAG', value: 'FARGATE-VPC' };

  const awsvpcConfiguration = await getAwsvpcConfiguration(tag);

  console.log(awsvpcConfiguration);
  
  return awsvpcConfiguration;
};