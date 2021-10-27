const cdk = require('@aws-cdk/core');
const sfn = require('@aws-cdk/aws-stepfunctions');
const create_step_1_lambda_task = require('./resources/create-step-1-lambda-task');
const create_step_2_wait_task = require('./resources/create-step-2-wait-task');
const create_step_3_fargate_task = require('./resources/create-step-3-fargate-task');
const create_step_4_wait_task = require('./resources/create-step-4-wait-task');
const create_step_5_lambda_task = require('./resources/create-step-5-lambda-task');

class FargateStepFunctionCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const step_1 = create_step_1_lambda_task(this);
    const waitX_2 = create_step_2_wait_task(this);
    const fargate_task = create_step_3_fargate_task(this);
    const waitX_4 = create_step_4_wait_task(this);
    const step_5 = create_step_5_lambda_task(this);

    const definition = step_1
      .next(waitX_2)
      .next(fargate_task)
      .next(waitX_4)
      .next(step_5);

    const STATE_MACHINE_NAME = 'STEP_TEST_STATE_MACHINE';
    new sfn.StateMachine(this, STATE_MACHINE_NAME, {
      stateMachineName: STATE_MACHINE_NAME,
      definition,
      timeout: cdk.Duration.minutes(5)
    });
  }
}

module.exports = { FargateStepFunctionCdkStack }
