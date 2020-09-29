const cdk = require('@aws-cdk/core');
const sfn = require('@aws-cdk/aws-stepfunctions');
const create_step_1_lambda_task = require('./resources/create-step-1-lambda-task');
const create_step_2_wait_task = require('./resources/create-step-2-wait-task');
const create_step_3_fargate_task = require('./resources/create-step-3-fargate-task');

class FargateStepFunctionCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const step_1 = create_step_1_lambda_task(this);
    const waitX = create_step_2_wait_task(this);
    const fargate_task = create_step_3_fargate_task(this);

    const definition = step_1.next(waitX).next(fargate_task);

    const STATE_MACHINE_NAME = 'STEP_TEST_STATE_MACHINE';
    new sfn.StateMachine(this, STATE_MACHINE_NAME, {
      stateMachineName: STATE_MACHINE_NAME,
      definition,
      timeout: cdk.Duration.minutes(5)
    });
  }
}

module.exports = { FargateStepFunctionCdkStack }
