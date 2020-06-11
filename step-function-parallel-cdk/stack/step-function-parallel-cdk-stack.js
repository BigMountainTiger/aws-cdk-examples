const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const iam = require('@aws-cdk/aws-iam');

class StepFunctionParallelCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const NAME_PREFIX = 'SFN_PARALLEL_TEST';
    const BUCKET_NAME = `${NAME_PREFIX}_BUCKET`;
    const bucket = new s3.Bucket(this, BUCKET_NAME, {
      bucketName: `${BUCKET_NAME.toLowerCase().replace(/_/g, '-')}.huge.head.li`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const ROLE_NAME = `${NAME_PREFIX}_ROLE`;
    const role = new iam.Role(this, ROLE_NAME, {
      roleName: ROLE_NAME,
      description: ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents',
        's3:GetObject', 's3:PutObject']
    }));



  }
}

module.exports = { StepFunctionParallelCdkStack }
