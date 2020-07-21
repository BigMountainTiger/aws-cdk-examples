const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');

class HugeHeadLiCFBucketStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const bucket_name = `huge-head-li-cf-bucket`;
    new s3.Bucket(this, bucket_name, {
      bucketName: bucket_name,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [ {expiration: cdk.Duration.days(1)} ]
    })
  }
}

module.exports = { HugeHeadLiCFBucketStack }