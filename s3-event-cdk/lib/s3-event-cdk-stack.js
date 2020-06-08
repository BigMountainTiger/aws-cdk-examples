const cdk = require('@aws-cdk/core');
const s3_bucket = require('./resources/s3-bucket');

class S3EventCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
   
    const bucket = s3_bucket(this);
    
  }
}

module.exports = { S3EventCdkStack }
