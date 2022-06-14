const { RemovalPolicy } = require('aws-cdk-lib');
const cdk = require('aws-cdk-lib');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');

// https://bobbyhadz.com/blog/aws-cdk-dynamodb-table
class DynamoExcerciseStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    (() => {

      const NAME = 'TABLE_1'
      const dtb = new dynamodb.Table(this, `${id}-${NAME}`, {
        billingMode: dynamodb.BillingMode.PROVISIONED,
        readCapacity: 1,
        writeCapacity: 1,
        tableName: NAME,
        partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'time', type: dynamodb.AttributeType.STRING },
        RemovalPolicy: cdk.RemovalPolicy.DESTROY
      });

      
    })();

  }
}

module.exports = { DynamoExcerciseStack }
