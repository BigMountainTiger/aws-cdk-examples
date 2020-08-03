var AWS = require('aws-sdk');

AWS.config.update({ 
  region: 'us-east-1' 
});

exports.lambdaHandler = async (event, context) => {
  
  const image_id = 'ami-07300f2e42fc5a12b';
  const instanceParams = {
     ImageId: image_id, 
     InstanceType: 't2.micro',
     KeyName: 'my-key-pair',
     MinCount: 1,
     MaxCount: 1
  };

  let result
  try {

    const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
    result = await ec2.runInstances(instanceParams).promise();
    
    // A lambda is unable to wait the instance to start. there must be some other ways to check the status
    // result = await ec2.waitFor('instanceRunning', {InstanceIds: [result.Instances[0].InstanceId]}).promise();

  } catch(ex) {
    
    console.log('Failed');
    console.log(ex);
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify(result)
  };

};