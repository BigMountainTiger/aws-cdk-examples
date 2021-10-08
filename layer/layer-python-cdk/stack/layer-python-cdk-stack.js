const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

class LayerPythonCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ROLE_NAME = `${id}-ROLE_NAME`;
    const role = new iam.Role(this, ROLE_NAME, {
      roleName: ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
    }));

    const LAYER_NAME = `${id}-LAYER`;
    const layer = new lambda.LayerVersion(this, LAYER_NAME, {
      layerVersionName: LAYER_NAME,
      code: lambda.Code.fromAsset('./Python/Layer'),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_8],
      description: LAYER_NAME
    });

    const LAMBDA_NAME = `${id}-LAMBDA`;
    new lambda.Function(this, LAMBDA_NAME, {
      runtime: lambda.Runtime.PYTHON_3_8,
      functionName: LAMBDA_NAME,
      role: role,
      code: lambda.Code.fromAsset('./Python/Lambda'),
      layers: [layer],
      handler: 'app.lambdaHandler'
    });

    // This is a lambda without the layer. Test where to put the dependencies
    const LAMBDA_TEST_NAME = `${id}-LAMBDA_TEST`;
    new lambda.Function(this, LAMBDA_TEST_NAME, {
      runtime: lambda.Runtime.PYTHON_3_8,
      functionName: LAMBDA_TEST_NAME,
      role: role,
      code: lambda.Code.fromAsset('./Python/Lambda-test'),
      handler: 'app.lambdaHandler'
    });

  }
}

module.exports = { LayerPythonCdkStack }
