const cdk = require('aws-cdk-lib');
const logs = require('aws-cdk-lib/aws-logs');

exports.create = (context) => {
  const id = context.id;
  const scope = context.scope;

  const NAME = 'EXPERIMENT-LOG-GROUP'
  const logGroup = new logs.LogGroup(scope, `${id}-${NAME}`, {
    logGroupName: NAME,
    retention: cdk.Duration.days(1).toDays(),
    removalPolicy: cdk.RemovalPolicy.DESTROY
  });

  return logGroup
};