const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'DynamoCdkStackDynamoTable';

(async () => {

  const item = {
    TableName: TABLE_NAME,
    Item: {id: 'A', name: 'This is A'}
  };

  await new Promise((rs, rj) => {
    docClient.put(item, (e, d) => {
      if (e) { rj(e); } else { rs(d); }
    })
  });

  docClient.scan({TableName: TABLE_NAME}, (e, d) => {
    if (e) {
      console.log(e);
    } else {
      console.log(d);
    }
  })

})();

console.log('Initiated ...');
