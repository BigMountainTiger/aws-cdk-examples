// https://stackoverflow.com/questions/63815158/aws-step-functions-and-fargate-task-container-runtime-error-does-not-cause-pipe
// Pass parameter to ECS

// https://docs.aws.amazon.com/step-functions/latest/dg/input-output-example.html
// InputPath, ResultPath and OutputPath are simply filters

const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const sfn = require('aws-cdk-lib/aws-stepfunctions');
const tasks = require('aws-cdk-lib/aws-stepfunctions-tasks');


class StepFunctionInputOutputAndContextStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const create_lambda_role = (name, actions) => {
      const role_name = `${id}_${name}`;
      const principal = new iam.ServicePrincipal('lambda.amazonaws.com');
      const role = new iam.Role(this, role_name, { roleName: role_name, description: role_name, assumedBy: principal });
      role.addToPolicy(new iam.PolicyStatement({ effect: iam.Effect.ALLOW, resources: ['*'], actions: actions }));

      return role;
    };

    const create_lambda = (name, path, role) => {
      const lambda_name = `${id}_${name}`;

      return new lambda.Function(this, lambda_name, {
        runtime: lambda.Runtime.NODEJS_14_X,
        functionName: lambda_name,
        description: lambda_name,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.asset(path),
        memorySize: 256,
        handler: 'app.lambdaHandler'
      });
    };

    const lambda_role = create_lambda_role('LAMBDA_ROLE', [
      'logs:CreateLogGroup',
      'logs:CreateLogStream',
      'logs:PutLogEvents'
    ]);

    const lambda_step_1 = create_lambda('STEP_1', './lambdas/step-1', lambda_role);
    const lambda_step_2 = create_lambda('STEP_2', './lambdas/step-2', lambda_role);

    const STEP_1_NAME = `STEP_1`;
    const step_1 = new tasks.LambdaInvoke(this, STEP_1_NAME, {
      lambdaFunction: lambda_step_1,
      retryOnServiceExceptions: false,
      inputPath: '$',
      outputPath: '$'
    });

    const STEP_2_NAME = `STEP_2`;
    const step_2 = new tasks.LambdaInvoke(this, STEP_2_NAME, {
      lambdaFunction: lambda_step_2,
      retryOnServiceExceptions: false,
      inputPath: '$$',
      outputPath: '$',
    });

    const definition = step_1
      .next(step_2);
  
    const STATE_MACHINE_NAME = `Experiment_STEP_FUNCTION`;
    new sfn.StateMachine(this, `${id}-${STATE_MACHINE_NAME}`, {
      stateMachineName: STATE_MACHINE_NAME,
      definition: definition,
      timeout: cdk.Duration.minutes(5)
    });

  }
}

module.exports = { StepFunctionInputOutputAndContextStack }
