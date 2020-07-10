const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');

const add_bucket = (scope, id) => {
  const name = `${id}-BUCKET`;

  const bucket = new s3.Bucket(scope, name, {
    bucketName: `huge.head.li.${id.toLowerCase().replace(/_/g, '-')}`,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    versioned: false,
    removalPolicy: cdk.RemovalPolicy.DESTROY
  });

  return bucket;
};

module.exports = add_bucket;