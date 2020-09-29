const cdk = require('@aws-cdk/core');
const sfn = require('@aws-cdk/aws-stepfunctions');

const create_step_3_fargate_task = (scope) => {

  const STEP_NAME = 'STEP_TEST_FARGATE_TASK';
  return new sfn.Wait(scope, STEP_NAME, {
    time: sfn.WaitTime.duration(cdk.Duration.seconds(3))
  });
};

module.exports = create_step_3_fargate_task;