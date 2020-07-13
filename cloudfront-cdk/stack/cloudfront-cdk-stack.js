const cdk = require('@aws-cdk/core');

const meta_lambda = require('./resources/s3-web-meta-lambda');
const s3_web_bucket = require('./resources/s3-web-bucket');
const s3_web_cloudfront = require('./resources/s3-web-cloudfront');

class CloudfrontCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const lambda = meta_lambda(this, id);
    const bucket = s3_web_bucket(this, id);
    const cloudfront = s3_web_cloudfront(this, id, bucket);
    
  }
}

module.exports = { CloudfrontCdkStack }
