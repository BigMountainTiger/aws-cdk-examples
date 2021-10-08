const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');

class VoiceNumberRecognitionStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const role = (() => {
      const ROLE_NAME = `${id}-Lambda-Role`;
      const principal = new iam.ServicePrincipal('lambda.amazonaws.com');
      const role = new iam.Role(this, ROLE_NAME, { roleName: ROLE_NAME, assumedBy: principal });

      const actions = ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'];
      role.addToPolicy(new iam.PolicyStatement({ effect: iam.Effect.ALLOW, resources: ['*'], actions: actions }));

      return role;
    })();

    const python_layer = (() => {

      const LAYER_NAME = `${id}-PYTHON-LAYER`;
      const path = 'lambdas/python-layer';

      return new lambda.LayerVersion(this, LAYER_NAME, {
        layerVersionName: LAYER_NAME,
        code: lambda.Code.fromAsset(path),
        compatibleRuntimes: [lambda.Runtime.PYTHON_3_9],
        description: LAYER_NAME
      });
    })();

    const silero_layer = (() => {

      const LAYER_NAME = `${id}-SILERO-LAYER`;
      const path = 'lambdas/silero-layer';

      return new lambda.LayerVersion(this, LAYER_NAME, {
        layerVersionName: LAYER_NAME,
        code: lambda.Code.fromAsset(path),
        compatibleRuntimes: [lambda.Runtime.PYTHON_3_9],
        description: LAYER_NAME
      });
    })();

    const func = (() => {

      const FUNCTION_NAME = `${id}-Lambda`;
      const path = 'lambdas/voice-recognizer';

      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.PYTHON_3_9,
        layers: [python_layer, silero_layer],
        functionName: FUNCTION_NAME,
        memorySize: 2 * 1024,
        timeout: cdk.Duration.seconds(120),
        role: role,
        code: lambda.Code.fromAsset(path),
        handler: 'app.lambdaHandler'
      });

      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      })

      return func;
    })();

    const api = (() => {
      const API_NAME = `${id}-API-GW`
      return  new apigateway.RestApi(this, API_NAME, {
        restApiName: API_NAME,
        description: API_NAME,
        defaultCorsPreflightOptions: {
          allowOrigins: apigateway.Cors.ALL_ORIGINS,
          allowMethods: apigateway.Cors.ALL_METHODS,
        },
        binaryMediaTypes: ['multipart/form-data'],
        endpointTypes: [apigateway.EndpointType.REGIONAL]
      });
    })();

    api.root.addMethod('GET', new apigateway.LambdaIntegration(func, { proxy: true }));

  }
}

module.exports = { VoiceNumberRecognitionStack }
