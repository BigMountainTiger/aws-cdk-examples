const cdk = require('@aws-cdk/core');

const s3_web_bucket = require('./resources/s3-web-bucket');

class CloudfrontCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const bucket = s3_web_bucket(this, id);
  }
}

module.exports = { CloudfrontCdkStack }
