const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const events = require('aws-cdk-lib/aws-events');
const targets = require('aws-cdk-lib/aws-events-targets');

class EventBridgeEcsHistoryStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const event_bridge_listener = (() => {

      const ROLE_NAME = `ecs_event_bridge_listener-LAMBDA_ROLE`;
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

      const NAME = 'ecs_event_bridge_listener';
      const func = new lambda.Function(this, `${id}-${NAME}`, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: NAME,
        description: NAME,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.asset('./lambdas/ecs-event-bridge-listener'),
        memorySize: 128,
        handler: 'app.lambdaHandler'
      });

      return func;

    })();

    // Create the event-bridge rule
    (() => {
      const NAME = 'ecs-event-bridge-rule';
      const rule = new events.Rule(this, `${id}-${NAME}`, {
        ruleName: NAME,
        eventPattern: {
          source: ['aws.ecs'],
          detailType: ['ECS Task State Change', 'ECS Container Instance State Change'],
          detail: {
            clusterArn: ['arn:aws:ecs:us-east-1:275118158658:cluster/FargateTask2022Stack-CLUSTER']
          }
        }
      });

      rule.addTarget(new targets.LambdaFunction(event_bridge_listener));
      return rule;
    })();
    
  }
}

module.exports = { EventBridgeEcsHistoryStack }
