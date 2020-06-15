const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');

class S3LambdaTempCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const BUCKET_NAME = 'S3_LAMBDA_TEMP_BUCKET';
    new s3.Bucket(this, BUCKET_NAME, {
      bucketName: `${BUCKET_NAME.toLowerCase().replace(/_/g, '-')}.huge.head.li`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    
    
  }
}

module.exports = { S3LambdaTempCdkStack }
