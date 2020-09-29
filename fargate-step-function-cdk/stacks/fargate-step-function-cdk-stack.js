const cdk = require('@aws-cdk/core');
const sfn = require('@aws-cdk/aws-stepfunctions');
const tasks = require('@aws-cdk/aws-stepfunctions-tasks');
const get_step_1_lambda = require('./resources/get-step-1-lambda');

class FargateStepFunctionCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const step_1_lambda = get_step_1_lambda(this);

    const STEP_1_NAME = 'STEP_TEST_MACHINE_STEP_1';
    const step_1 = new tasks.LambdaInvoke(this, STEP_1_NAME, {
      lambdaFunction: step_1_lambda,
      inputPath: '$',
      outputPath: '$.Payload',
    });

    const STEP_WAIT_NAME = 'STEP_TEST_MACHINE_STEP_WAIT';
    const waitX = new sfn.Wait(scope, STEP_WAIT_NAME, {
      time: sfn.WaitTime.duration(cdk.Duration.seconds(30))
    });

    const definition = step_1.next(waitX);

    const STATE_MACHINE_NAME = 'STEP_TEST_STATE_MACHINE';
    new sfn.StateMachine(this, STATE_MACHINE_NAME, {
      stateMachineName: STATE_MACHINE_NAME,
      definition,
      timeout: cdk.Duration.minutes(5)
    });
  }
}

module.exports = { FargateStepFunctionCdkStack }
