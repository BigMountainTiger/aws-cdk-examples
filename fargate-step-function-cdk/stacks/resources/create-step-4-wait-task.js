const cdk = require('@aws-cdk/core');
const sfn = require('@aws-cdk/aws-stepfunctions');

const create_step_4_wait_task = (scope) => {

  const STEP_WAIT_NAME = 'STEP_TEST_MACHINE_STEP_4_WAIT';
  return new sfn.Wait(scope, STEP_WAIT_NAME, {
    time: sfn.WaitTime.duration(cdk.Duration.seconds(3))
  });
};

module.exports = create_step_4_wait_task;