const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');
const sfn = require('@aws-cdk/aws-stepfunctions');
const tasks = require('@aws-cdk/aws-stepfunctions-tasks');

class StepFunctionParallelCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const NAME_PREFIX = 'SFN_PARALLEL_TEST';
    const BUCKET_NAME = `${NAME_PREFIX}_BUCKET`;
    const bucket = new s3.Bucket(this, BUCKET_NAME, {
      bucketName: `${BUCKET_NAME.toLowerCase().replace(/_/g, '-')}.huge.head.li`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const ROLE_NAME = `${NAME_PREFIX}_ROLE`;
    const role = new iam.Role(this, ROLE_NAME, {
      roleName: ROLE_NAME,
      description: ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents',
        's3:GetObject', 's3:PutObject']
    }));

    const s3_writter_lambda_name = `${NAME_PREFIX}_S3_WRITTER_LAMBDA`;
    const s3_writter_lambda = new lambda.Function(this, s3_writter_lambda_name, {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: s3_writter_lambda_name,
      description: s3_writter_lambda_name,
      timeout: cdk.Duration.seconds(15),
      role: role,
      code: lambda.Code.asset('./lambdas/sfn-parallel-test-s3-writter-lambda'),
      memorySize: 256,
      handler: 'app.lambdaHandler'
    });

    const STEP_1_NAME = `${NAME_PREFIX}_STEP_1`;
    const step_1 = new tasks.LambdaInvoke(this, STEP_1_NAME, {
      lambdaFunction: s3_writter_lambda,
      payload: sfn.TaskInput.fromObject({
        text: 'this'
      }),
      outputPath: '$.Payload',
    });

    const definition = step_1;

    const STATE_MACHINE_NAME = `${NAME_PREFIX}_STATE_MACHINE`;
    new sfn.StateMachine(this, STATE_MACHINE_NAME, {
      stateMachineName: STATE_MACHINE_NAME, definition, timeout: cdk.Duration.minutes(5)
    });
  }
}

// https://stackoverflow.com/questions/58663076/does-aws-step-functions-have-a-timeout-feature
module.exports = { StepFunctionParallelCdkStack }
