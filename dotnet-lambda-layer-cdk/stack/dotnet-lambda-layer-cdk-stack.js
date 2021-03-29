const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

class DotnetLambdaLayerCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ROLE_NAME = `${id}-Lambda_Role`;

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

    const LAYER_NAME = `${id}-LambdaDotnetLayer`;
    const layer_path = 'lambda/LambdaDotnetLayer/publish/package.zip';
    const layer = new lambda.LayerVersion(this, LAYER_NAME, {
      layerVersionName: LAYER_NAME,
      code: lambda.Code.fromAsset(layer_path),
      compatibleRuntimes: [lambda.Runtime.DOTNET_CORE_3_1],
      description: LAYER_NAME
    });

    const FUNCTION_NAME = `${id}-LambdaDotnetLayerExample`;
    const function_path = 'lambda/LambdaDotnetLayerExample/publish/package.zip';
    new lambda.Function(this, FUNCTION_NAME, {
      runtime: lambda.Runtime.DOTNET_CORE_3_1,
      layers: [layer],
      functionName: FUNCTION_NAME,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(120),
      role: role,
      code: lambda.Code.fromAsset(function_path),
      handler: `LambdaDotnetLayerExample::LambdaDotnetLayerExample.Function::FunctionHandler`
    });
    

  }
}

module.exports = { DotnetLambdaLayerCdkStack }
