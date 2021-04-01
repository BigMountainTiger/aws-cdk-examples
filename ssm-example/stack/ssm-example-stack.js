const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');

class SsmExampleStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ROLE_NAME = `${id}-LAMBDA-ROLE`;

    const add_lambda_role = () => {
      const role = new iam.Role(this, ROLE_NAME, {
        roleName: ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      return role;
    };

    const role = add_lambda_role();
      
    const add_lambda = (role, path, FUNCTION_NAME) => {

      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.PYTHON_3_8,
        functionName: FUNCTION_NAME,
        memorySize: 128,
        timeout: cdk.Duration.seconds(120),
        role: role,
        code: lambda.Code.fromAsset(path),
        handler: 'app.lambdaHandler'
      });

      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      })

      return func;
    };

    const func = add_lambda(role, './lambda/test_lambda', `${id}-TEST-LAMBDA`);

    const API_NAME = `${id}-API`
    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      binaryMediaTypes: ['multipart/form-data'],
      endpointTypes: [apigateway.EndpointType.REGIONAL]
    });

    let resource = api.root.addResource('test');
    resource.addMethod('GET', new apigateway.LambdaIntegration(func, { proxy: true }));

  }
}

module.exports = { SsmExampleStack }
