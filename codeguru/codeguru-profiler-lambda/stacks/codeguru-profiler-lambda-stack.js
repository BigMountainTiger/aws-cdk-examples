const cdk = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
const iam = require('aws-cdk-lib/aws-iam');
const apigateway = require('aws-cdk-lib/aws-apigateway');

class CodeguruProfilerLambdaStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const role = (() => {
      const NAME = 'LAMBDA-ROLE';
      const role = new iam.Role(this, `${id}-${NAME}`, {
        roleName: `${id}-${NAME}`,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['codeguru-profiler:ConfigureAgent', 'codeguru-profiler:PostAgentProfile']
      }));

      return role;

    })();

    const func = (() => {

      const NAME = 'EXAMPLE-LAMBDA';
      const func = new lambda.Function(this, `${id}-${NAME}`, {
        runtime: lambda.Runtime.PYTHON_3_8,
        functionName: NAME,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.fromAsset('./lambdas/AFunction'),
        handler: 'app.lambdaHandler',
        environment: {
          AWS_LAMBDA_EXEC_WRAPPER: '/opt/codeguru_profiler_lambda_exec',
          AWS_CODEGURU_PROFILER_GROUP_NAME: 'Test',
          AWS_CODEGURU_PROFILER_TARGET_REGION: 'us-east-1',
          AWS_CODEGURU_PROFILER_ENABLED: 'TRUE'
        }
      });

      const arn = 'arn:aws:lambda:us-east-1:157417159150:layer:AWSCodeGuruProfilerPythonAgentLambdaLayer:11';
      const layer = lambda.LayerVersion.fromLayerVersionArn(this, 'CODEGURU-LAYER', arn);

      func.addLayers(layer)

      return func;

    })();

    (() => {
      const NAME = 'EXAMPLE-API-GW';

      const api = new apigateway.RestApi(this, `${id}-${NAME}`, {
        restApiName: NAME,
        description: NAME,
        endpointTypes: [apigateway.EndpointType.REGIONAL]
      });

      const resource = api.root;
      resource.addMethod('GET', new apigateway.LambdaIntegration(func, { proxy: true }));

    })();

  }
}

module.exports = { CodeguruProfilerLambdaStack }
