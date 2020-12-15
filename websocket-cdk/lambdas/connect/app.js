// Example code
// https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/

const AWS = require('aws-sdk');
const DDB = new AWS.DynamoDB();

exports.lambdaHandler = async (event, context) => {
  
  console.log(event);

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: { connectionId: { S: event.requestContext.connectionId } }
  };

  let err = null;
  try { await DDB.putItem(params).promise(); } catch(e) { err = e; }
  
  return {
    statusCode: err ? 500 : 200,
    body: err ? "Failed to connect: " + JSON.stringify(err) : "Connected"
  };
  
};