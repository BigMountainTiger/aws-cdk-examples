const cf = require('@aws-cdk/aws-cloudfront');

const add_cloudfront = (scope, id, bucket) => {
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

  const cloudfront = new cf.CloudFrontWebDistribution(scope, NAME, {
    comment: NAME,
    originConfigs: [
      {
        
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: oai
        },
        behaviors: [
          { isDefaultBehavior: true , default_ttl: 31536000, lambdaFunctionAssociations: [
            
          ]}
        ],
      }
    ],
    errorConfigurations: errorConfigurations
  });

  return cloudfront;
};

module.exports = add_cloudfront;