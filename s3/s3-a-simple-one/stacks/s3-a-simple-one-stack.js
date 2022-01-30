const cdk = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');

class S3ASimpleOneStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    (() => {

      const NAME = 'example';
      new s3.Bucket(this, `${id}-${NAME}`, {
        bucketName: `${NAME}.huge.head.li`,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        versioned: false,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });
    })();

  }
}

module.exports = { S3ASimpleOneStack }
