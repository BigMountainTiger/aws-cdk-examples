const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');
const s3 = require('@aws-cdk/aws-s3');

class ApiCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const add_bucket = (name) => {
      const bucket = new s3.Bucket(this, name, {
        bucketName: `${name.toLowerCase().replace(/_/g, '-')}.huge.head.li`,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        versioned: false,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });
    
      return bucket;
    };

    add_bucket('api-cdk');

    const ROLE_NAME = `${id}MyRole`;
    const API_NAME = `${id}APIGW`;

    const add_lambda_role = () => {
      const role = new iam.Role(this, ROLE_NAME, {
        roleName: ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['arn:aws:s3:::*'],
        actions: ['s3:GetObject', 's3:PutObject']
      }));

      return role;
    };

    const add_lambda = (role, path, FUNCTION_NAME) => {

      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: FUNCTION_NAME,
        timeout: cdk.Duration.seconds(120),
        role: role,
        code: lambda.Code.fromAsset(path),
        handler: 'index.handler'
      });

      return func;
    };

    const role = add_lambda_role();
    const handler_base64 = add_lambda(role, './lambda/AFunction-base64', `${id}AFunction-base64`);
    const handler_multipart = add_lambda(role, './lambda/AFunction-multipart', `${id}AFunction-multipart`);
    const handler_download = add_lambda(role, './lambda/AFunction-download', `${id}AFunction-download`);

    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      binaryMediaTypes: ['*~1*'],
      endpointTypes: [apigateway.EndpointType.REGIONAL]
    });

    const attach_endpoint_base64 = api.root.addResource('attach-base64').addResource('{key}');
    attach_endpoint_base64.addMethod('POST', new apigateway.LambdaIntegration(handler_base64, { proxy: true }));

    const attach_endpoint_multipart = api.root.addResource('attach-multipart').addResource('{key}');
    attach_endpoint_multipart.addMethod('POST', new apigateway.LambdaIntegration(handler_multipart, { proxy: true }));

    const attach_endpoint_downloaed = api.root.addResource('download');
    attach_endpoint_downloaed.addMethod('GET', new apigateway.LambdaIntegration(handler_download, { proxy: true }));

  }
}

module.exports = { ApiCdkStack }
