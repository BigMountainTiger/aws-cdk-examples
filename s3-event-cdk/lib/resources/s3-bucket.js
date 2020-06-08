const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');

const name = 'S3_EVENT_BUCKET';

const add_bucket = (context) => {
  return new s3.Bucket(context, name, {
    bucketName: `${name.toLowerCase().replace(/_/g, '-')}.huge.head.li`,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    versioned: false,
    removalPolicy: cdk.RemovalPolicy.DESTROY
  });
};

module.exports = add_bucket;