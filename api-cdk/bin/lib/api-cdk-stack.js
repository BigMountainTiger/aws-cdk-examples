const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');

class ApiCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const ROLE_NAME = `${id}MyRole`;
    const FUNCTION_NAME = `${id}AFunction`;
    const API_NAME = `${id}APIGW`;

    const add_lambda_role = () => {
      const role = new iam.Role(this, ROLE_NAME, {
        roleName: ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }))

      return role;
    };

    const add_lambda = (role) => {

      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: FUNCTION_NAME,
        timeout: cdk.Duration.seconds(120),
        role: role,
        code: lambda.Code.asset('./lambda/AFunction'),
        handler: 'index.handler'
      });

      return func;
    };

    const role = add_lambda_role();
    const handler = add_lambda(role);

    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      },
      endpointTypes: [apigateway.EndpointType.REGIONAL]
    });

    const attach_endpoint = api.root.addResource('attach').addResource('{key}');
    attach_endpoint.addMethod('POST', new apigateway.LambdaIntegration(handler, { proxy: true }));

    // attach_endpoint.addMethod('OPTIONS', new apigateway.MockIntegration({
    //   integrationResponses: [
    //     {
    //       statusCode: "200",
    //       responseParameters: {
    //         "method.response.header.Access-Control-Allow-Headers": "'*'",
    //         "method.response.header.Access-Control-Allow-Methods": "'GET,POST,OPTIONS'",
    //         "method.response.header.Access-Control-Allow-Origin": "'*'"
    //       },
    //       responseTemplates: { "application/json": "" }
    //     }
    //   ],
    //   passthroughBehavior: apigateway.PassthroughBehavior.Never,
    //   requestTemplates: {
    //     "application/json": "{\"statusCode\": 200}"
    //   },
    // }));
  }
}

module.exports = { ApiCdkStack }
