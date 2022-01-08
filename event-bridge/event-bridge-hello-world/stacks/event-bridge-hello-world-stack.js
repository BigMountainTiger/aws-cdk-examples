// https://github.com/aws-samples/amazon-ecs-stopped-tasks-cwlogs

const cdk = require('aws-cdk-lib');
const logs = require('aws-cdk-lib/aws-logs');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const events = require('aws-cdk-lib/aws-events');
const targets = require('aws-cdk-lib/aws-events-targets');


class EventBridgeHelloWorldStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    // const log_group = (() => {
    //   const NAME = 'event-bridge-hello-world';
    //   return new logs.LogGroup(this, `${id}-${NAME}`, {
    //     logGroupName: NAME,
    //     removalPolicy: cdk.RemovalPolicy.DESTROY
    //   });
    // })();

    const event_bridge_listener = (() => {
      const ROLE_NAME = `event_bridge_listener-LAMBDA_ROLE`;
      const role = new iam.Role(this, `${id}-${ROLE_NAME}`, {
        roleName: ROLE_NAME,
        description: ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      const NAME = 'event_bridge_listener';
      const func = new lambda.Function(this, `${id}-${NAME}`, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: NAME,
        description: NAME,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.asset('./lambdas/event-bridge-listener'),
        memorySize: 128,
        handler: 'app.lambdaHandler'
      });

      return func;

    })();

    const rule = (() => {
      const NAME = 'event-bridge-hello-world-rule';
      const rule = new events.Rule(this, `${id}-${NAME}`, {
        ruleName: NAME,
        schedule: events.Schedule.cron({})
      });

      rule.addTarget(new targets.LambdaFunction(event_bridge_listener));
      return rule;
    })();

  }
}

module.exports = { EventBridgeHelloWorldStack }
