const AWS = require('aws-sdk');
const DDB = new AWS.DynamoDB();

exports.lambdaHandler = async (event, context) => {
  
  console.log(event);

  const params = { TableName: process.env.TABLE_NAME, ProjectionExpression: 'connectionId' };
  const connections = await DDB.scan(params).promise();

  const api = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });

  const postData = JSON.parse(event.body).data;

  const calls = connections.Items.map(async (connection) => {

    const id = connection.connectionId.S;
    
    try {
      await api.postToConnection({ ConnectionId: id, Data: postData }).promise();
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${id}`);
        await DDB.deleteItem({ TableName: process.env.TABLE_NAME, Key: { connectionId: { S: id } } }).promise();
      } else { throw e; }
    }
  });
  
  await Promise.all(calls);

  return {
    statusCode: 200,
    body: JSON.stringify(event)
  };
  
};