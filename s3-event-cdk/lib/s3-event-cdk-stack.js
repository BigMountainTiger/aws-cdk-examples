const cdk = require('@aws-cdk/core');

class S3EventCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    
  }
}

module.exports = { S3EventCdkStack }
