const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

const VPC_TAG = {
  key: 'aws-cdk:subnet-name',
  value: 'PUBLIC-SUBNET-CONFIG'
};

(async () => {

  const tag_api = new AWS.ResourceGroupsTaggingAPI();
  const vpcs = await tag_api.getResources({
    TagFilters: [
      {
        Key: VPC_TAG.key,
        Values: [VPC_TAG.value]
      }
    ]
  }).promise();

  console.log(vpcs);
  
})();
