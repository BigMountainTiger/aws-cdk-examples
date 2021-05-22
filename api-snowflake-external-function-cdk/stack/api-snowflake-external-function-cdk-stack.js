const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');

class ApiSnowflakeExternalFunctionCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const role = (() => {
      const ROLE_NAME = `${id}-lambda-role`;
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
    })();

    const layer = ((path) => {
      const LAYER_NAME = `${id}-handler-dependency-layer`;

      return new lambda.LayerVersion(this, LAYER_NAME, {
        layerVersionName: LAYER_NAME,
        code: lambda.Code.fromAsset(path),
        compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        description: LAYER_NAME
      });
    })('./lambda/dependencies');

    const func = ((role, layer, path, FUNCTION_NAME) => {

      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.NODEJS_14_X,
        functionName: FUNCTION_NAME,
        timeout: cdk.Duration.seconds(15),
        role: role,
        layers: [layer],
        code: lambda.Code.fromAsset(path),
        handler: 'index.handler'
      });

      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      })

      return func;
    })(role, layer, './lambda/handler', `${id}-api-handler`);

    const api = (() => { 
      
      const API_NAME = `${id}-API`;
      return new apigateway.RestApi(this, API_NAME, {
        restApiName: API_NAME,
        description: API_NAME,
        endpointTypes: [apigateway.EndpointType.REGIONAL]
      });

    })();

    ((api) => {
      const ROLE_NAME = `${id}-SNOWFLAKE`;
      const role = new iam.Role(this, ROLE_NAME, {
        roleName: ROLE_NAME,
        assumedBy: new iam.AnyPrincipal()
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [api.arnForExecuteApi()],
        actions: ['*']
      }));
    })(api);

    api.root.addMethod('POST', new apigateway.LambdaIntegration(func, { proxy: true }));

  }
}

module.exports = { ApiSnowflakeExternalFunctionCdkStack }
