const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');

const add_bucket = (scope, id) => {
  const NAME = `${id}-BUCKET`;

  const bucket = new s3.Bucket(scope, NAME, {
    bucketName: `huge.head.li.${id.toLowerCase().replace(/_/g, '-')}`,
    removalPolicy: cdk.RemovalPolicy.DESTROY
  });

  return bucket;
};

module.exports = add_bucket;