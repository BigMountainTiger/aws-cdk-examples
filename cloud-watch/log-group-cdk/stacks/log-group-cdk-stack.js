const cdk = require('aws-cdk-lib');
const logs = require('aws-cdk-lib/aws-logs');

class LogGroupCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const NAME = 'EXPERIMENT-LOG-GROUP'
    const logGroup = new logs.LogGroup(this, `${id}-${NAME}`, {
      logGroupName: NAME,
      retention: cdk.Duration.days(1).toDays(),
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

  }
}

module.exports = { LogGroupCdkStack }
