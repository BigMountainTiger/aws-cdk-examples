// Websocket is still not fully supported by aws-cdk

const cdk = require('@aws-cdk/core');
const apiv2 = require('@aws-cdk/aws-apigatewayv2');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const iam = require("@aws-cdk/aws-iam");

class WebsocketCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const API_NAME = `${id}-WEBSOCKET-API`;
    const api = new apiv2.CfnApi(this, API_NAME, {
      name: API_NAME,
      description: API_NAME,
      protocolType: "WEBSOCKET",
      routeSelectionExpression: "$request.body.action",
    });
    
    const DYNAMO_NAME = `${id}-DYNAMO-TABLE`;
    const table = new dynamodb.Table(this, DYNAMO_NAME, {
      tableName: DYNAMO_NAME,
      partitionKey: { name: "connectionId", type: dynamodb.AttributeType.STRING },
      readCapacity: 5, writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const LAMBDA_ROLE_NAME = `${id}-LAMBDA-ROLE`;
    const lambda_role = new iam.Role(this, LAMBDA_ROLE_NAME, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    });
    lambda_role.addToPolicy(new iam.PolicyStatement({ actions: [ 'dynamodb:*' ], resources: [table.tableArn] }));
    lambda_role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
    
  }
}

module.exports = { WebsocketCdkStack }
