const cdk = require('@aws-cdk/core');
const add_sqs = require('./resources/add-sqs');
const add_lambdas = require('./resources/add-lambdas');

class SnowflakPipeAutomationStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    add_sqs(this);
    add_lambdas(this);
  }
}

module.exports = { SnowflakPipeAutomationStack }
