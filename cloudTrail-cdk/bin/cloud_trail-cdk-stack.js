// aws s3 rm s3://cloudtrailcdkstackcloudtrail.huge.head.li --recursive

const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const s3 = require('@aws-cdk/aws-s3');
const lambda = require('@aws-cdk/aws-lambda');
const logs = require('@aws-cdk/aws-logs');
const cloudtrail = require('@aws-cdk/aws-cloudtrail');

class CloudTrailCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const BUCKET_NAME = `${id}CloudTrail.huge.head.li`.toLocaleLowerCase();
    const CLOUDTRAIL_NAME = `${id}CloudTrail`;

    const add_cloudTrail = () => {

      const bucket =  new s3.Bucket(this, `${CLOUDTRAIL_NAME}Bucket`, {
        bucketName: BUCKET_NAME,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        lifecycleRules: [{ enabled: true, expiration: cdk.Duration.days(1), id: `${BUCKET_NAME}.expire` }],
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });

      const trail = new cloudtrail.Trail(this, CLOUDTRAIL_NAME, {
        trailName: CLOUDTRAIL_NAME,
        cloudWatchLogsRetention: logs.RetentionDays.ONE_DAY,
        isMultiRegionTrail: false,
        managementEvents: cloudtrail.ReadWriteType.ALL,
        sendToCloudWatchLogs: true,
        bucket: bucket
      });

      return trail;
    };

    const add_lambda = () => {
      const NAME = `${CLOUDTRAIL_NAME}CloudWatchExpire`;

      const func =  new lambda.Function(this, NAME, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: NAME,
        code: lambda.Code.asset('./lambda/change-cloudwatch-expire'),
        handler: 'index.handler',
        timeout: cdk.Duration.seconds(20)
      });

      const statement = new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:putRetentionPolicy']
      });

      func.addToRolePolicy(statement);

      return func;
      
    };

    add_cloudTrail();
    const expire_lambda = add_lambda();

  }
}

module.exports = { CloudTrailCdkStack }
