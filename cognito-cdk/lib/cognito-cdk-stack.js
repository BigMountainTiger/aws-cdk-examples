const cdk = require('@aws-cdk/core');
const cognito = require('@aws-cdk/aws-cognito');
const apigateway = require('@aws-cdk/aws-apigateway');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');

class CognitoCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ID = id;
    const USERPOOL_NAME = `${ID}UserPool`;
    const USERPOOL_GROUP_NAME = `${USERPOOL_NAME}Group`;
    const USERPOOL_GROUP_ROLE_NAME = `${USERPOOL_GROUP_NAME}Role`;
    const USERPOOL_GROUP_POLICY_NAME = `${USERPOOL_GROUP_NAME}Policy`;
    const USERPOOL_CLIENT_NAME = `${USERPOOL_NAME}Client`;
    const IDENTITY_POOL_NAME = `${ID}IdentityPool`;
    const IDENTITY_POOL_ATTACHMENT_NAME = `${IDENTITY_POOL_NAME}Attachment`;

    const add_user_pool = () => {
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

      return user_pool;
    };

    const add_user_pool_client = (pool) => {
      const user_pool_client = new cognito.UserPoolClient(this, USERPOOL_CLIENT_NAME, {
        userPool: pool,
        userPoolClientName: USERPOOL_CLIENT_NAME,
        generateSecret: false,
        authFlows: {
          userPassword: true,
          userSrp: true,
          refreshToken: true
        }
      })
      
      return user_pool_client;
    };

    const add_identity_pool = (user_pool, user_pool_client) => {
      const identity_pool = new cognito.CfnIdentityPool(this, IDENTITY_POOL_NAME, {
        identityPoolName: IDENTITY_POOL_NAME,
        allowUnauthenticatedIdentities: false,
        cognitoIdentityProviders: [{
            clientId: user_pool_client.userPoolClientId,
            providerName: user_pool.userPoolProviderName,
          }]
      });

      const identity_provider = `${user_pool.userPoolProviderName}:${user_pool_client.userPoolClientId}`;
      new cognito.CfnIdentityPoolRoleAttachment(this, IDENTITY_POOL_ATTACHMENT_NAME, {
        identityPoolId: identity_pool.ref,
        roleMappings: {
          userpool1: {
            identityProvider: identity_provider,
            type: 'Token',
            ambiguousRoleResolution: 'Deny'
          }
        },
        roles: {}
      })

      return identity_pool;
    }

    const add_api = (user_pool) => {
      const API_NAME = `${ID}Api`;
      const LAMBDA_NAME = `${API_NAME}Lambda`;
      const AUTHORIZER_NAME = `${API_NAME}Authorizer`;

      const api = new apigateway.RestApi(this, API_NAME, {
        restApiName: API_NAME,
        description: API_NAME,
        endpointTypes: [ apigateway.EndpointType.REGIONAL ]
      });

      const f = new lambda.Function(this, LAMBDA_NAME, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: LAMBDA_NAME,
        code: lambda.Code.asset('./lambda/function-1'),
        handler: 'index.handler'
      });
      
      // const authorizer = new apigateway.CfnAuthorizer(this, AUTHORIZER_NAME, {
      //   name: AUTHORIZER_NAME,
      //   identitySource: 'method.request.header.Authorization',
      //   restApiId: api.restApiId,
      //   providerArns: [user_pool.userPoolArn],
      //   type: apigateway.AuthorizationType.COGNITO,
      // });

      // api.root.addMethod("GET", new apigateway.LambdaIntegration(f, { proxy: true }), {
      //   authorizationType: apigateway.AuthorizationType.COGNITO,
      //   authorizer: { authorizerId: authorizer.ref }
      // });

      api.root.addMethod("GET", new apigateway.LambdaIntegration(f, { proxy: true }), {
        authorizationType: apigateway.AuthorizationType.IAM
      });

      return api;
    };

    const add_user_pool_group = (user_pool, identity_pool) => {
      const role = new iam.Role(this, USERPOOL_GROUP_ROLE_NAME, {
        roleName: USERPOOL_GROUP_ROLE_NAME,
        assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': identity_pool.ref
          }
        }, 'sts:AssumeRoleWithWebIdentity')
      });

      role.addToPolicy(new iam.PolicyStatement({ effect: 'Allow', actions: ['cognito-identity:*'], resources: ['*'] }));
      role.addToPolicy(new iam.PolicyStatement({ effect: 'Allow', actions: ['execute-api:Invoke'], resources: ['*'] }));

      new cognito.CfnUserPoolGroup(this, USERPOOL_GROUP_NAME, {
        groupName: USERPOOL_GROUP_NAME,
        userPoolId: user_pool.userPoolId,
        roleArn: role.roleArn
      });
      
    };

    const user_pool = add_user_pool();
    const user_pool_client = add_user_pool_client(user_pool);
    const identity_pool = add_identity_pool(user_pool, user_pool_client);
    add_api(user_pool);
    add_user_pool_group(user_pool, identity_pool);

  }
}

module.exports = { CognitoCdkStack }
