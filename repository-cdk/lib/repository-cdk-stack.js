const cdk = require('@aws-cdk/core');

class RepositoryCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

  }
}

module.exports = { RepositoryCdkStack }
