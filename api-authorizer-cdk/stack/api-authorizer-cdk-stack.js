const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');

class ApiAuthorizerCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ROLE_NAME = `${id}-LAMBDA-ROLE`;
    const role = new iam.Role(this, ROLE_NAME, {
      roleName: ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
    }));

    const API_FUNCTION_NAME = `${id}-API_FUNCTION`;
    const api_func = new lambda.Function(this, API_FUNCTION_NAME, {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: API_FUNCTION_NAME,
      timeout: cdk.Duration.seconds(120),
      role: role,
      code: lambda.Code.fromAsset('./lambda/api-function'),
      handler: 'index.handler'
    });

    const API_NAME = `${id}-API_GWY`;
    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      endpointTypes: [apigateway.EndpointType.REGIONAL]
    });

    const api_root = api.root;
    api_root.addMethod('GET', new apigateway.LambdaIntegration(api_func, { proxy: true }));
  }
}

module.exports = { ApiAuthorizerCdkStack }
