const cf = require('@aws-cdk/aws-cloudfront');

const add_cloudfront = (scope, id, bucket, nocache_lambda) => {
  const NAME = `${id}-CLOUDFRONT`;

  const oai = new cf.OriginAccessIdentity(scope, `${id}-OriginAccessIdentity`);
  const errorConfigurations = [
    {
      errorCode: 403,
      responseCode: 200,
      responsePagePath: '/index.html'
    },
    {
      errorCode: 404,
      responseCode: 200,
      responsePagePath: '/index.html'
    }
  ];

  let lambda_associations = [];
  // UNCOMMENT to add the association
  // lambda_associations = [{
  //   eventType: cf.LambdaEdgeEventType.VIEWER_RESPONSE,
  //   lambdaFunction: nocache_lambda.currentVersion
  // }];

  const cloudfront = new cf.CloudFrontWebDistribution(scope, NAME, {
    comment: NAME,
    priceClass: cf.PriceClass.PRICE_CLASS_100,
    originConfigs: [
      {
        
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: oai
        },
        behaviors: [
          { isDefaultBehavior: true , default_ttl: 31536000, lambdaFunctionAssociations: lambda_associations}
        ],
      }
    ],
    errorConfigurations: errorConfigurations
  });

  return cloudfront;
};

module.exports = add_cloudfront;