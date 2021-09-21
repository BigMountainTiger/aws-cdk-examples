const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');

const name = 'S3_EVENT_BUCKET';

const add_bucket = (scope) => {
  const bucket = new s3.Bucket(scope, name, {
    bucketName: `${name.toLowerCase().replace(/_/g, '-')}.huge.head.li`,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    versioned: false,
    removalPolicy: cdk.RemovalPolicy.DESTROY
  });

  return bucket;
};

module.exports = add_bucket;