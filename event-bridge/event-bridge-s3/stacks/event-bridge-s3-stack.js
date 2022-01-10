// https://aws.amazon.com/blogs/compute/using-dynamic-amazon-s3-event-handling-with-amazon-eventbridge/

const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const s3 = require('aws-cdk-lib/aws-s3');
const events = require('aws-cdk-lib/aws-events');
const targets = require('aws-cdk-lib/aws-events-targets');


class EventBridgeS3Stack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const cloudtrail_bucket = (() => {
      const NAME = 'cloudtrail-s3.bucket.huge.head.li';
      const bucket = new s3.Bucket(this, `${id}-${NAME}`, {
        bucketName: NAME,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });

      return bucket;
    })();

    const listener = (() => {
      const ROLE_NAME = `s3_event_bridge_listener-LAMBDA_ROLE`;
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

      const NAME = 's3_event_bridge_listener';
      const func = new lambda.Function(this, `${id}-${NAME}`, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: NAME,
        description: NAME,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.asset('./lambdas/s3-event-bridge-listener'),
        memorySize: 128,
        handler: 'app.lambdaHandler'
      });

      return func;

    })();

    const rule = (() => {
      const NAME = 's3-event-bridge-rule';
      const rule = new events.Rule(this, `${id}-${NAME}`, {
        ruleName: NAME,
        eventPattern: {
          source: ['aws.s3']
        }
      });

      rule.addTarget(new targets.LambdaFunction(listener));
      return rule;
    })();

    

  }
}

module.exports = { EventBridgeS3Stack }
