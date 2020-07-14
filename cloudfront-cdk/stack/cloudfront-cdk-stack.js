const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const eventSources = require('@aws-cdk/aws-lambda-event-sources');

const copylambda = require('./resources/s3-web-copy-lambda');
const nocachelambda = require('./resources/s3-web-nocache-lambda');
const s3_web_bucket = require('./resources/s3-web-bucket');
const s3_web_cloudfront = require('./resources/s3-web-cloudfront');

class CloudfrontCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const copy_lambda = copylambda(this, id);
    const nocache_lambda = nocachelambda(this, id);
    const bucket = s3_web_bucket(this, id);
    const cloudfront = s3_web_cloudfront(this, id, bucket);

    copy_lambda.addEventSource(new eventSources.S3EventSource(bucket, {
      events: [s3.EventType.OBJECT_CREATED_PUT]
    }));
    
  }
}

module.exports = { CloudfrontCdkStack }
