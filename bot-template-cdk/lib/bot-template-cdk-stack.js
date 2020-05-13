const cdk = require('@aws-cdk/core');
const add_sqs = require('./resources/add_sqs');

class BotTemplateCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    add_sqs(this);
  }
}

module.exports = { BotTemplateCdkStack }
