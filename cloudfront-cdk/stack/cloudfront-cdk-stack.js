const cdk = require('@aws-cdk/core');

class CloudfrontCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

  }
}

module.exports = { CloudfrontCdkStack }
