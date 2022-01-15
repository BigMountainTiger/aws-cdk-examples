const cdk = require('aws-cdk-lib');
const log_group = require('./resources/log-group');

class StepFunctionFargateContextStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);
    const context = { id: id, scope: this };

    const lgp = log_group.create(context);
  }
}

module.exports = { StepFunctionFargateContextStack }
