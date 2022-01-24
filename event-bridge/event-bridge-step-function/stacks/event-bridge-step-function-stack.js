const cdk = require('aws-cdk-lib');
const sfn = require('aws-cdk-lib/aws-stepfunctions');
const tasks = require('aws-cdk-lib/aws-stepfunctions-tasks');
const events = require('aws-cdk-lib/aws-events');
const targets = require('aws-cdk-lib/aws-events-targets');

class EventBridgeStepFunctionStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const machine = (() => {

      const pass = (name) => {
        return new sfn.Pass(this, name, { comment: name });
      };

      const pass1 = pass('PASS-1');
      const pass2 = pass('PASS-2');

      const choice = new sfn.Choice(this, '1 or 2?')
        .when(sfn.Condition.stringEquals('$.choice', '1'), pass1)
        .when(sfn.Condition.stringEquals('$.choice', '2'), pass2);

      const NAME = `EVENT_BRIDGE_TRIGGERED_STEP_FUNCTION`;
      return new sfn.StateMachine(this, `${id}-${NAME}`, {
        stateMachineName: NAME,
        definition: sfn.Chain.start(choice),
        timeout: cdk.Duration.minutes(1)
      });

    })();

    // This is to demonstrate two events with different inputs
    // that triggered the step function to go to different choice branches
    (() => {
      const NAME = 'EVENT-BRIGHT-CHOICE-1';
      const rule = new events.Rule(this, `${id}-${NAME}`, {
        ruleName: NAME,
        schedule: events.Schedule.cron({
          minute: '0/10',
          hour: '*',
          day: '*',
          month: '*',
          year: '*'
        })
      });

      rule.addTarget(new targets.SfnStateMachine(machine, {
        input: events.RuleTargetInput.fromObject({
          choice: "1"
        })
      }));

    })();

    (() => {
      const NAME = 'EVENT-BRIGHT-CHOICE-2';
      const rule = new events.Rule(this, `${id}-${NAME}`, {
        ruleName: NAME,
        schedule: events.Schedule.cron({
          minute: '0/10',
          hour: '*',
          day: '*',
          month: '*',
          year: '*'
        })
      });

      rule.addTarget(new targets.SfnStateMachine(machine, {
        input: events.RuleTargetInput.fromObject({
          choice: "2"
        })
      }));

    })();
  }
}

module.exports = { EventBridgeStepFunctionStack }
