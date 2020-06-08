const cdk = require('@aws-cdk/core');

const s3 = require('@aws-cdk/aws-s3');
const s3_event_source = require('@aws-cdk/aws-lambda-event-sources');

const s3_bucket = require('./resources/s3-bucket');
const s3_event_lambda_handler = require("./resources/s3-event-lambda-handler");

class S3EventCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
   
    const bucket = s3_bucket(this);
    const handler = s3_event_lambda_handler(this);
    
    handler.addEventSource(new s3_event_source.S3EventSource(bucket, {
      events: [ s3.EventType.OBJECT_CREATED ]
    }));
  }
}

module.exports = { S3EventCdkStack }
