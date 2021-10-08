const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');
const ecr = require('@aws-cdk/aws-ecr');

class VoiceNumberRecognitionDockerStack extends cdk.Stack {
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

    const repository = ecr.Repository.fromRepositoryName(this, 'voice-recognizer', 'voice-recognizer');
    const func = (() => {

      const FUNCTION_NAME = `${id}-Lambda`;

      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.FROM_IMAGE,
        functionName: FUNCTION_NAME,
        memorySize: 4 * 1024,
        timeout: cdk.Duration.seconds(120),
        role: role,
        code: lambda.Code.fromEcrImage(repository, {
          tag: '0.0.1'
        }),
        handler: lambda.Handler.FROM_IMAGE
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

module.exports = { VoiceNumberRecognitionDockerStack }
