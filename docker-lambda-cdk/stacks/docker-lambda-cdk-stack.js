const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

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

    const IN_LAMBDA_NAME = `${id}-IN`;
    new lambda.Function(this, IN_LAMBDA_NAME, {
      runtime: lambda.Runtime.PYTHON_3_8,
      functionName: IN_LAMBDA_NAME,
      description: IN_LAMBDA_NAME,
      timeout: cdk.Duration.seconds(30),
      role: lambda_role,
      code: lambda.Code.fromAsset('lambdas/IN'),
      memorySize: 1024,
      handler: 'app.lambdaHandler'
    });

  }
}

module.exports = { DockerLambdaCdkStack }
