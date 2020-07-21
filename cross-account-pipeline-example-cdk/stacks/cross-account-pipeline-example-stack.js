const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');

class CrossAccountPipelineExampleStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const bucket_name = `${id}-BUCKET`;
    new s3.Bucket(this, bucket_name, {
      bucketName: bucket_name.toLowerCase(),
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })
  }
}

module.exports = { CrossAccountPipelineExampleStack }
