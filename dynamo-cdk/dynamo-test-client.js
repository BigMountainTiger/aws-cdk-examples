const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'DynamoCdkStackDynamoTable';

(async () => {

  const put_parameter = {
    TableName: TABLE_NAME,
    Item: {id: 'A', name1: 'This is A', attribute: 'Another one'}
  };

  await new Promise((rs, rj) => {
    docClient.put(put_parameter, (e, d) => {
      if (e) { rj(e); } else { rs(d); }
    })
  });

  const update_parameter = {
    TableName: TABLE_NAME,
    Key: {id: 'A'},
    UpdateExpression: 'set name1 = :n1, name2 = :n2',
    ExpressionAttributeValues: {
        ':n1': 'This is bullshit',
        ':n2': 'n2 is added'
    },
    ReturnValues:"UPDATED_NEW"
  };

  let p = new Promise((rs, rj) => {
    docClient.update(update_parameter, (e, d) => {
      if (e) { rj(e); } else { rs(d); }
    });
  });
  
  try {
    await p;
    //console.log(result);
  } catch(ex) {

    console.log(ex);
  }

  const get_parameter = {
    TableName: TABLE_NAME,
    Key: {id: 'A'}
  };
  let result = await new Promise((rs, rj) => {
    docClient.get(get_parameter, (e, d) => {
      if (e) { rj(e); } else { rs(d); }
    });
  });

  console.log(result);

  const delete_parameter = {
    TableName: TABLE_NAME,
    Key: {id: 'A'}
  };
  result = await new Promise((rs, rj) => {
    docClient.delete(delete_parameter, (e, d) => {
      if (e) { rj(e); } else { rs(d); }
    });
  });

  console.log(result);

  docClient.scan({TableName: TABLE_NAME}, (e, d) => {
    if (e) {
      console.log(e);
    } else {
      console.log(d);
    }
  })

})();

console.log('Initiated ...');
