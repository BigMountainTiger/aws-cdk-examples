const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

const NAME = require('./NAME');

const add_dependency_layer = (scope) => {

  const name = NAME.SNOWFLAKE_S3_PIPE_DEPENDENCY_LAYER_NAME;
  return new lambda.LayerVersion(scope, name, {
    layerVersionName: name,
    code: lambda.Code.fromAsset('./lambdas/snowflake-s3-pipe-dependency-layer'),
    compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
    description: name
  });
};

module.exports = (scope) => {
  const layer = add_dependency_layer(scope);
};