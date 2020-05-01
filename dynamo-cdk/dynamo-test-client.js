const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
});

var docClient = new AWS.DynamoDB.DocumentClient();

docClient.scan({TableName: 'DynamoCdkStackDynamoTable'}, (e, d) => {
  if (e) {
    console.log(e);
  } else {
    console.log(d);
  }
})