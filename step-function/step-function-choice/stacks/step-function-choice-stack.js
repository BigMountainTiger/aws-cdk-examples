const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const sfn = require('aws-cdk-lib/aws-stepfunctions');
const tasks = require('aws-cdk-lib/aws-stepfunctions-tasks');

class StepFunctionChoiceStack extends cdk.Stack {

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
        memorySize: 128,
        handler: 'app.lambdaHandler'
      });
    };

    const lambda_role = create_lambda_role('LAMBDA_ROLE', [
      'logs:CreateLogGroup',
      'logs:CreateLogStream',
      'logs:PutLogEvents'
    ]);

    const lambda_choice_1 = create_lambda('CHOICE_1', './lambdas/choice-1', lambda_role);
    const lambda_choice_2 = create_lambda('CHOICE_2', './lambdas/choice-2', lambda_role);

    const CHOICE_1_NAME = `CHOICE 1`;
    const choice_1 = new tasks.LambdaInvoke(this, CHOICE_1_NAME, {
      lambdaFunction: lambda_choice_1,
      retryOnServiceExceptions: false,
      inputPath: '$',
      outputPath: '$'
    });

    const CHOICE_2_NAME = `CHOICE 2`;
    const choice_2 = new tasks.LambdaInvoke(this, CHOICE_2_NAME, {
      lambdaFunction: lambda_choice_2,
      retryOnServiceExceptions: false,
      inputPath: '$',
      outputPath: '$'
    });

    const success = new sfn.Succeed(this, 'Done');
    const choice = new sfn.Choice(this, '1 or 2?')
      .when(sfn.Condition.stringEquals('$.choice', '1'), choice_1)
      .when(sfn.Condition.stringEquals('$.choice', '2'), choice_2)
      .otherwise(success);

    const STATE_MACHINE_NAME = `Experiment_STEP_FUNCTION`;
    new sfn.StateMachine(this, `${id}-${STATE_MACHINE_NAME}`, {
      stateMachineName: STATE_MACHINE_NAME,
      definition: sfn.Chain.start(choice),
      timeout: cdk.Duration.minutes(5)
    });

  }
}

module.exports = { StepFunctionChoiceStack }
