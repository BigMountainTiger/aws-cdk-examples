const AWS = require('aws-sdk');
const DDB = new AWS.DynamoDB();

exports.lambdaHandler = async (event, context) => {
  
  console.log(event);
  
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: { connectionId: { S: event.requestContext.connectionId } }
  };

  let err = null;
  try { await DDB.deleteItem(params).promise(); } catch(e) { err = e; }
  
  const result = {
    statusCode: err ? 500 : 200,
    body: err ? "Failed to disconnect: " + JSON.stringify(err) : "Connected"
  };

  console.log(result);

  return result;
  
};