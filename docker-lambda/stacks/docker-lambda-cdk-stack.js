const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');
const ecr = require('@aws-cdk/aws-ecr');
const apigateway = require('@aws-cdk/aws-apigateway');

class DockerLambdaCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const LAMBDA_ROLE_NAME = `${id}-LAMBDA_ROLE`;
    const lambda_role = new iam.Role(this, LAMBDA_ROLE_NAME, {
      roleName: LAMBDA_ROLE_NAME,
      description: LAMBDA_ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    lambda_role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents', 's3:GetObject', 's3:PutObject']
    }));

    lambda_role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['lambda:InvokeFunction']
    }));

    const repository = ecr.Repository.fromRepositoryName(this, 'word2pdf-lambda', 'word2pdf-lambda');
    const PDF_LAMBDA_NAME = `${id}-RECEIPT-LAMBDA`;
    const receipt_lambda = new lambda.Function(this, PDF_LAMBDA_NAME, {
      runtime: lambda.Runtime.FROM_IMAGE,
      functionName: PDF_LAMBDA_NAME,
      description: PDF_LAMBDA_NAME,
      timeout: cdk.Duration.seconds(30),
      role: lambda_role,
      code: lambda.Code.fromEcrImage(repository, {
        tag: '0.0.1'
      }),
      memorySize: 1536,
      handler: lambda.Handler.FROM_IMAGE
    });

    const API_NAME = `${id}-RECEIPT-API`;
    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      },
      endpointTypes: [apigateway.EndpointType.REGIONAL]
    });

    const endpoint = api.root.addResource('receipt');
    endpoint.addMethod('POST', new apigateway.LambdaIntegration(receipt_lambda, { proxy: true }));
  }
}

module.exports = { DockerLambdaCdkStack }
