// Websocket is still not fully supported by aws-cdk

const cdk = require('@aws-cdk/core');
const apiv2 = require('@aws-cdk/aws-apigatewayv2');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const iam = require("@aws-cdk/aws-iam");
const lambda = require('@aws-cdk/aws-lambda');


const region = 'us-east-1';

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

    const API_ROLE_NAME = `${id}-API-ROLE`;
    const api_role = new iam.Role(this, API_ROLE_NAME, { assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com") });
    api_role.addToPolicy(new iam.PolicyStatement({ resources: ['*'], actions: ["lambda:InvokeFunction"] }));

    const CONNECT_LAMBDA_NAME = `${id}-ICONNECT-LAMBDA`;
    const connect_lambda = new lambda.Function(this, CONNECT_LAMBDA_NAME, {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: CONNECT_LAMBDA_NAME,
      description: CONNECT_LAMBDA_NAME,
      timeout: cdk.Duration.seconds(30),
      role: lambda_role,
      code: lambda.Code.fromAsset('lambdas/connect'),
      memorySize: 256,
      handler: 'app.lambdaHandler'
    });

    const CONNECT_INTEGRATION_NAME = `${id}-CONNECT_INTEGRATION`;
    const connect_integration = new apiv2.CfnIntegration(this, CONNECT_INTEGRATION_NAME, {
      apiId: api.ref,
      integrationType: "AWS_PROXY",
      integrationUri: "arn:aws:apigateway:" + region + ":lambda:path/2015-03-31/functions/" + connect_lambda.functionArn + "/invocations",
      credentialsArn: api_role.roleArn,
    });

  }
}

module.exports = { WebsocketCdkStack }
