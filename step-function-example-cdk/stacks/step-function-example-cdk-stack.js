const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');
const sfn = require('@aws-cdk/aws-stepfunctions');
const tasks = require('@aws-cdk/aws-stepfunctions-tasks');

class StepFunctionExampleCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const PREFIX = 'STEP_FUNCTION_EXAMPLE';

    const create_role = () => {
      const role_name = `${PREFIX}_LAMBDA_ROLE`;
      const role = new iam.Role(this, role_name, {
        roleName: role_name,
        description: role_name,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: [ 'logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents' ]
      }));

      return role;
    };

    const role = create_role();
    const create_lambda = (name, path) => {
      const lambda_name = `${PREFIX}_${name}`;

      return new lambda.Function(this, lambda_name, {
        runtime: lambda.Runtime.PYTHON_3_8,
        functionName: lambda_name,
        description: lambda_name,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.asset(path),
        memorySize: 256,
        handler: 'app.lambda_handler'
      });
    };

    const sum_lambda = create_lambda('SUM_LAMBDA',
      './lambdas/sum-lambda/');
    const square_lambda = create_lambda('SQUARE_LAMBDA',
      './lambdas/square-lambda/');

    const STEP_1_NAME = `${PREFIX}_STEP_1_SUM`;
    const step_1 = new tasks.LambdaInvoke(this, STEP_1_NAME, {
      lambdaFunction: sum_lambda, inputPath: '$', outputPath: '$.Payload',
    });
  
    const STEP_2_NAME = `${PREFIX}_STEP_1_SQUARE`;
    const step_2 = new tasks.LambdaInvoke(this, STEP_2_NAME, {
      lambdaFunction: square_lambda, inputPath: '$', outputPath: '$.Payload',
    });
  
    const STEP_WAIT_NAME = `${PREFIX}_STEP_WAIT`;
    const waitX = new sfn.Wait(this, STEP_WAIT_NAME, {
      time: sfn.WaitTime.duration(cdk.Duration.seconds(3))
    });
  
    const definition = step_1.next(waitX).next(step_2);
  
    const STATE_MACHINE_NAME = `${PREFIX}_STATE_MACHINE`;
    new sfn.StateMachine(this, STATE_MACHINE_NAME, {
      stateMachineName: STATE_MACHINE_NAME,
      definition: definition,
      timeout: cdk.Duration.minutes(5)
    });

  }
}

module.exports = { StepFunctionExampleCdkStack }
