const cdk = require('@aws-cdk/core');
const dynamodb = require('@aws-cdk/aws-dynamodb');

class DynamoCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const PREFIX = id;
    const DYNAMO_TABLE = `${PREFIX}DynamoTable`

    const add_table = () => {
      const table = new dynamodb.Table(this, DYNAMO_TABLE, {
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        tableName: DYNAMO_TABLE,
        partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
      });

      return table;
    };
    
    add_table();
  }
}

module.exports = { DynamoCdkStack }
