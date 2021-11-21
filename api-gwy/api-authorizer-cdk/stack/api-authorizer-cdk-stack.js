const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');
const cognito = require('@aws-cdk/aws-cognito');

class ApiAuthorizerCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ROLE_NAME = `${id}-LAMBDA-ROLE`;
    const role = new iam.Role(this, ROLE_NAME, {
      roleName: ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
    }));

    const API_FUNCTION_NAME = `${id}-API_FUNCTION`;
    const api_func = new lambda.Function(this, API_FUNCTION_NAME, {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: API_FUNCTION_NAME,
      description: API_FUNCTION_NAME,
      timeout: cdk.Duration.seconds(120),
      role: role,
      code: lambda.Code.fromAsset('./lambda/api-function'),
      handler: 'index.handler'
    });

    const AUTHORIZER_FUNCTION_NAME = `${id}-AUTHORIZER_FUNCTION`;
    const authorizer_func = new lambda.Function(this, AUTHORIZER_FUNCTION_NAME, {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: AUTHORIZER_FUNCTION_NAME,
      description: AUTHORIZER_FUNCTION_NAME,
      timeout: cdk.Duration.seconds(120),
      role: role,
      code: lambda.Code.fromAsset('./lambda/authorizer-function'),
      handler: 'index.handler'
    });

    const API_NAME = `${id}-API_GWY`;
    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      endpointTypes: [apigateway.EndpointType.REGIONAL]
    });

    const AUTH_NAME = `${id}-AUTH`;
    let auth = new apigateway.RequestAuthorizer(this, AUTH_NAME, {
      identitySources: ['method.request.header.Authorization'],
      handler: authorizer_func
    });

    const api_root = api.root;
    api_root.addMethod('GET', new apigateway.LambdaIntegration(api_func, { proxy: true }), { authorizer: auth });

    // Cognito
    const USERPOOL_NAME = `${id}-USERPOOL`;
    const user_pool = new cognito.UserPool(this, USERPOOL_NAME, {
      userPoolName: USERPOOL_NAME,
      passwordPolicy: {},
      userInvitation: {
        emailSubject: `Invite to join our awesome app!`,
        emailBody: `Hello {username},
          you have been invited to join our awesome app! Your temporary password is {####}`,
        smsMessage: `Hello {username},
          your temporary password for our awesome app is {####}`
      }
    });

    const USERPOOL_CLIENT_NAME = `${id}-USERPOOL_CLIENT`;
    new cognito.UserPoolClient(this, USERPOOL_CLIENT_NAME, {
      userPool: user_pool,
      userPoolClientName: USERPOOL_CLIENT_NAME,
      generateSecret: false,
      authFlows: { userPassword: true, userSrp: true, refreshToken: true }
    });

  }
}

module.exports = { ApiAuthorizerCdkStack }
