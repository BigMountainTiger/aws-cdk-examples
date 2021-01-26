import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class TypescriptCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const S3_NAME = `${id}-Bucket`;
    new s3.Bucket(this, S3_NAME, {
      bucketName: `${S3_NAME.toLowerCase().replace(/_/g, '-')}.huge.head.li`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}
