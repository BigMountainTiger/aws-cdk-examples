const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');
const tasks = require('@aws-cdk/aws-stepfunctions-tasks');

const create_step_1_lambda_task = (scope) => {

  const role_name = 'STEP_EXAMPLE_STEP_1_LAMBDA_ROLE';
  const role = new iam.Role(scope, role_name, {
    roleName: role_name,
    description: role_name,
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  role.addToPolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    resources: ['*'],
    actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
  }));

  const lambda_name = 'STEP_EXAMPLE_STEP_1_LAMBDA';
  const step_1_lambda = new lambda.Function(scope, lambda_name, {
    runtime: lambda.Runtime.NODEJS_12_X,
    functionName: lambda_name,
    description: lambda_name,
    timeout: cdk.Duration.seconds(15),
    role: role,
    code: lambda.Code.fromAsset('./lambdas/step-1'),
    memorySize: 256,
    handler: 'app.lambdaHandler'
  });

  const STEP_1_NAME = 'STEP_TEST_MACHINE_STEP_1';
  return new tasks.LambdaInvoke(scope, STEP_1_NAME, {
    lambdaFunction: step_1_lambda,
    inputPath: '$',
    outputPath: '$.Payload',
  });
};

module.exports = create_step_1_lambda_task;