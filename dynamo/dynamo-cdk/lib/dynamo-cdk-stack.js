const cdk = require('@aws-cdk/core');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');
const apigateway = require('@aws-cdk/aws-apigateway');

class DynamoCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const PREFIX = id;
    const DYNAMO_TABLE = `${PREFIX}DynamoTable`

    const add_table = () => {
      const table = new dynamodb.Table(this, DYNAMO_TABLE, {
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        tableName: DYNAMO_TABLE,
        partitionKey: { name: 'service', type: dynamodb.AttributeType.STRING }
      });

      return table;
    };
    
    add_table();

    const LAMBDA_ROLE_NAME = `${id}-LAMBDA_ROLE`;
    const lambda_role = new iam.Role(this, LAMBDA_ROLE_NAME, {
      roleName: LAMBDA_ROLE_NAME,
      description: LAMBDA_ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    lambda_role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
    }));

    const ADD_SERVICE_LAMBDA_NAME = `${id}-IN`;
    const add_service_lambda = new lambda.Function(this, ADD_SERVICE_LAMBDA_NAME, {
      runtime: lambda.Runtime.PYTHON_3_8,
      functionName: ADD_SERVICE_LAMBDA_NAME,
      description: ADD_SERVICE_LAMBDA_NAME,
      timeout: cdk.Duration.seconds(30),
      role: lambda_role,
      code: lambda.Code.fromAsset('lambdas/add-service'),
      handler: 'app.lambdaHandler'
    });

    const API_NAME = `${id}-AGWY`;
    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      },
      endpointTypes: [apigateway.EndpointType.REGIONAL]
    });

    const service = api.root.addResource('service');
    const add = service.addResource('add');
    add.addMethod('POST', new apigateway.LambdaIntegration(add_service_lambda, { proxy: true }));

  }
}

module.exports = { DynamoCdkStack }
