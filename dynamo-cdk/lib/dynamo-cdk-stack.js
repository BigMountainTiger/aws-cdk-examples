const cdk = require('@aws-cdk/core');

class DynamoCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

  }
}

module.exports = { DynamoCdkStack }
