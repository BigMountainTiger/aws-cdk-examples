const cdk = require('@aws-cdk/core');
const sfn = require('@aws-cdk/aws-stepfunctions');
const tasks = require('@aws-cdk/aws-stepfunctions-tasks');

const add_state_machine = (scope, theFunc) => {

  const STEP_1_NAME = 'STEP_TEST_MACHINE_STEP_1';
  const step_1 = new tasks.LambdaInvoke(scope, STEP_1_NAME, {
    lambdaFunction: theFunc,
    outputPath: '$.Payload',
  });

  const definition = step_1;

  const STATE_MACHINE_NAME = 'STEP_TEST_STATE_MACHINE';
  new sfn.StateMachine(scope, STATE_MACHINE_NAME, {
    stateMachineName: STATE_MACHINE_NAME,
    definition,
    timeout: cdk.Duration.minutes(5)
  });

};

module.exports = add_state_machine;