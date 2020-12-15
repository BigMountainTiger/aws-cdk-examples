// Websocket is still not fully supported by aws-cdk

const cdk = require('@aws-cdk/core');
const apiv2 = require('@aws-cdk/aws-apigatewayv2');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const iam = require("@aws-cdk/aws-iam");
const lambda = require('@aws-cdk/aws-lambda');


const region = 'us-east-1';

class WebsocketCdkStack extends cdk.Stack {

  create_route(name, route_key) {
    const {id, dynamo_table_name, api, lambda_role, api_role} = this.entries;

    const LAMBDA_NAME = `${id}-${name}-LAMBDA`;
    const lambda_function = new lambda.Function(this, LAMBDA_NAME, {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: LAMBDA_NAME,
      description: LAMBDA_NAME,
      timeout: cdk.Duration.seconds(30),
      role: lambda_role,
      code: lambda.Code.fromAsset(`lambdas/${name}`),
      memorySize: 256,
      handler: 'app.lambdaHandler',
      environment: { "TABLE_NAME": dynamo_table_name }
    });

    const INTEGRATION_NAME = `${id}-${name}_INTEGRATION`;
    const ROUTE_NAME = `${id}-${name}_ROUTE`;
    const integration = new apiv2.CfnIntegration(this, INTEGRATION_NAME, {
      apiId: api.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: 'arn:aws:apigateway:' + region + ':lambda:path/2015-03-31/functions/' + lambda_function.functionArn + '/invocations',
      credentialsArn: api_role.roleArn,
    });
    const route = new apiv2.CfnRoute(this, ROUTE_NAME, {
      apiId: api.ref, routeKey: route_key, authorizationType: 'NONE', target: 'integrations/' + integration.ref
    });

    return route;
  }

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
    const dynamo_table = new dynamodb.Table(this, DYNAMO_NAME, {
      tableName: DYNAMO_NAME,
      partitionKey: { name: "connectionId", type: dynamodb.AttributeType.STRING },
      readCapacity: 5, writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const LAMBDA_ROLE_NAME = `${id}-LAMBDA-ROLE`;
    const lambda_role = new iam.Role(this, LAMBDA_ROLE_NAME, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    });
    lambda_role.addToPolicy(new iam.PolicyStatement({ actions: [ 'dynamodb:*' ], resources: [dynamo_table.tableArn] }));
    lambda_role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));

    const API_ROLE_NAME = `${id}-API-ROLE`;
    const api_role = new iam.Role(this, API_ROLE_NAME, { assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com") });
    api_role.addToPolicy(new iam.PolicyStatement({ resources: ['*'], actions: ["lambda:InvokeFunction"] }));

    this.entries = { id: id, dynamo_table_name: DYNAMO_NAME, api: api, lambda_role: lambda_role, api_role: api_role };

    const connect_route = this.create_route('connect', '$connect');
    const disconnect_route = this.create_route('disconnect', '$disconnect');
    const sendMessage_route = this.create_route('sendMessage', 'sendMessage');

    const DEPLOYMENT_NAME = `{id}-DEPLOYMENT`;
    const deployment = new apiv2.CfnDeployment(this, DEPLOYMENT_NAME, { apiId: api.ref });

    const STAGE_NAME = `{id}-STAGE`;
    new apiv2.CfnStage(this, STAGE_NAME, { apiId: api.ref, autoDeploy: true, deploymentId: deployment.ref, stageName: "prod" });

    const dependencies = new cdk.ConcreteDependable();
    dependencies.add(connect_route);
    dependencies.add(disconnect_route);
    dependencies.add(sendMessage_route);
    deployment.node.addDependency(dependencies);

  }
}

module.exports = { WebsocketCdkStack }
