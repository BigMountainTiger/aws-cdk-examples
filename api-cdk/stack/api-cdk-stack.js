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
        lifecycleRules: [{ expiration: cdk.Duration.days(1) }],
        cors: [ {
          allowedMethods: ['GET', 'PUT', 'HEAD', 'POST'],
          allowedOrigins: ['*'],
          allowedHeaders: ['*']
        }],
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

      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      })

      return func;
    };

    const PYTHON_LAYER_NAME = `${id}-LAYER`;
    const python_layer = new lambda.LayerVersion(this, PYTHON_LAYER_NAME, {
      layerVersionName: PYTHON_LAYER_NAME,
      code: lambda.Code.fromAsset('./lambda/Python-layer'),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_8],
      description: PYTHON_LAYER_NAME
    });

    const add_lambda_python = (role, path, FUNCTION_NAME) => {

      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.PYTHON_3_8,
        layers: [python_layer],
        functionName: FUNCTION_NAME,
        memorySize: 1024,
        timeout: cdk.Duration.seconds(120),
        role: role,
        code: lambda.Code.fromAsset(path),
        handler: 'app.lambdaHandler'
      });

      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      })

      return func;
    };

    const add_lambda_dotnet = (role, FUNCTION_NAME) => {
      const path = `./lambda/${FUNCTION_NAME}/publish`;

      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.DOTNET_CORE_3_1,
        functionName: FUNCTION_NAME,
        memorySize: 1024,
        timeout: cdk.Duration.seconds(120),
        role: role,
        code: lambda.Code.fromAsset(path),
        handler: `${FUNCTION_NAME}::${FUNCTION_NAME}.Function::FunctionHandler`
      });
      
      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      })

      return func;
    };

    const role = add_lambda_role();
    const handler_base64 = add_lambda(role, './lambda/AFunction-base64', `${id}AFunction-base64`);
    const handler_download = add_lambda(role, './lambda/AFunction-download', `${id}AFunction-download`);
    const handler_upload = add_lambda(role, './lambda/AFunction-upload', `${id}AFunction-upload`);
    const handler_upload_python = add_lambda_python(role, './lambda/AFunction-upload-python', `${id}AFunction-upload-python`);
    const handler_post_presigned_python = add_lambda_python(role, './lambda/AFunction-post-presigned-python', `${id}AFunction-AFunction-post-presigned-python`);
    const handler_put_presigned_python = add_lambda_python(role, './lambda/AFunction-put-presigned-python', `${id}AFunction-AFunction-put-presigned-python`);
    const handler_get_presigned_python = add_lambda_python(role, './lambda/AFunction-get-presigned-python', `${id}AFunction-AFunction-get-presigned-python`);

    const handler_all_presigned_python = add_lambda_python(role, './lambda/AFunction-all-presigned-python', `${id}AFunction-all-presigned-python`);

    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      binaryMediaTypes: ['multipart/form-data'],
      endpointTypes: [apigateway.EndpointType.REGIONAL]
    });

    let resource = api.root.addResource('base64');
    resource.addMethod('POST', new apigateway.LambdaIntegration(handler_base64, { proxy: true }));

    resource = api.root.addResource('download');
    resource.addMethod('GET', new apigateway.LambdaIntegration(handler_download, { proxy: true }));

    resource = api.root.addResource('upload');
    resource.addMethod('POST', new apigateway.LambdaIntegration(handler_upload, { proxy: true }));

    resource = api.root.addResource('upload-python');
    resource.addMethod('POST', new apigateway.LambdaIntegration(handler_upload_python, { proxy: true }));

    resource = api.root.addResource('post_presigned_python');
    resource.addMethod('GET', new apigateway.LambdaIntegration(handler_post_presigned_python, { proxy: true }));

    resource = api.root.addResource('put_presigned_python');
    resource.addMethod('GET', new apigateway.LambdaIntegration(handler_put_presigned_python, { proxy: true }));

    resource = api.root.addResource('get_presigned_python').addResource('{key}');
    resource.addMethod('GET', new apigateway.LambdaIntegration(handler_get_presigned_python, { proxy: true }));

    // Get all presigned URLs given the name
    resource = api.root.addResource('get_all_presigned_python').addResource('{file_name}');
    resource.addMethod('GET', new apigateway.LambdaIntegration(handler_all_presigned_python, { proxy: true }));

    const handler_DotnetAllPresigned = add_lambda_dotnet(role, 'DotnetAllPresigned');
    resource = api.root.addResource('get_all_presigned_dotnet').addResource('{file_name}');
    resource.addMethod('GET', new apigateway.LambdaIntegration(handler_DotnetAllPresigned, { proxy: true }));
  }
}

module.exports = { ApiCdkStack }
