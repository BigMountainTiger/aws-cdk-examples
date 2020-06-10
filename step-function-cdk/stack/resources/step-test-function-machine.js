const cdk = require('@aws-cdk/core');
const sfn = require('@aws-cdk/aws-stepfunctions');
const tasks = require('@aws-cdk/aws-stepfunctions-tasks');

const add_state_machine = (scope, step_1_lambda, s3_put_lambda) => {

  const STEP_1_NAME = 'STEP_TEST_MACHINE_STEP_1';
  const step_1 = new tasks.LambdaInvoke(scope, STEP_1_NAME, {
    lambdaFunction: step_1_lambda,
    outputPath: '$.Payload',
  });

  const STEP_2_NAME = 'STEP_TEST_MACHINE_STEP_2';
  const step_2 = new tasks.LambdaInvoke(scope, STEP_2_NAME, {
    lambdaFunction: s3_put_lambda,
    inputPath: '$',
    outputPath: '$.Payload',
  });

  const definition = step_1.next(step_2);

  const STATE_MACHINE_NAME = 'STEP_TEST_STATE_MACHINE';
  new sfn.StateMachine(scope, STATE_MACHINE_NAME, {
    stateMachineName: STATE_MACHINE_NAME,
    definition,
    timeout: cdk.Duration.minutes(5)
  });

};

module.exports = add_state_machine;