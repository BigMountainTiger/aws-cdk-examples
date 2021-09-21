const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

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
    
    const ROLE_NAME = 'S3_LAMBDA_TEMP_LAMBDA_ROLE';
    const role = new iam.Role(this, ROLE_NAME, {
      roleName: ROLE_NAME,
      description: ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents', 's3:GetObject', 's3:PutObject']
    }));

    const LAMBDA_NAME = 'S3_LAMBDA_TEMP_LAMBDA';
    new lambda.Function(this, LAMBDA_NAME, {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: LAMBDA_NAME,
      description: LAMBDA_NAME,
      timeout: cdk.Duration.seconds(15),
      role: role,
      code: lambda.Code.asset('./lambdas/s3-lambda-temp-lambda'),
      memorySize: 256,
      handler: 'app.lambdaHandler'
    });

  }
}

module.exports = { S3LambdaTempCdkStack }
