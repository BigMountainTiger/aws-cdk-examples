const cdk = require('@aws-cdk/core');

class BotTemplateCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

  }
}

module.exports = { BotTemplateCdkStack }
