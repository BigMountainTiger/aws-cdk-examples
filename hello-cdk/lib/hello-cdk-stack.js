const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const lambda = require('@aws-cdk/aws-lambda');
const apigateway = require('@aws-cdk/aws-apigateway');

const add_bucket = (context) => {
  new s3.Bucket(context, 'MyFirstBucket', {
    bucketName: 'a.my.cdk.bucket.huge.head.li',
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    versioned: false,
    removalPolicy: cdk.RemovalPolicy.DESTROY
  });
};

const add_lambda = (context, name) => {
  return new lambda.Function(context, name, {
    runtime: lambda.Runtime.NODEJS_12_X,
    functionName: name,
    code: lambda.Code.asset('./resources'),
    handler: 'app.handler'
  });
};

class HelloCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    
    const the_function = add_lambda(this, 'TheLambdaFunction');

    new apigateway.LambdaRestApi(this, 'myapi1', {
      handler: the_function
    });

  }
}

module.exports = { HelloCdkStack }