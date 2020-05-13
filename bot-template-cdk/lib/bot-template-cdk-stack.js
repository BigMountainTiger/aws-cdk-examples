const cdk = require('@aws-cdk/core');
const add_sqs = require('./resources/add_sqs');
const add_lambdas = require('./resources/add_lambdas');

class BotTemplateCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    add_sqs(this);
    add_lambdas(this);
  }
}

module.exports = { BotTemplateCdkStack }
