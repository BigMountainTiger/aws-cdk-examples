const cdk = require('@aws-cdk/core');

const s3 = require('@aws-cdk/aws-s3');
const eventSources = require('@aws-cdk/aws-lambda-event-sources');

const s3_bucket = require('./resources/s3-bucket');
const s3_event_lambda_handler = require('./resources/s3-event-lambda-handler');
const s3_presigned_url_lambda = require('./resources/s3-presigned-url-lambda');
const s3_get_put_lambda = require('./resources/s3-get-put-lambda');

class S3EventCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
   
    const bucket = s3_bucket(this);
    const s3_event_handler = s3_event_lambda_handler(this);
    s3_presigned_url_lambda(this);
    s3_get_put_lambda(this);
    
    // https://github.com/aws/aws-cdk/issues/2781
    // A CDK bug here ...
    s3_event_handler.addEventSource(new eventSources.S3EventSource(bucket, {
      events: [ s3.EventType.OBJECT_CREATED ]
    }));
    
    //bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(s3_event_handler));
  }
}

module.exports = { S3EventCdkStack }
