const cdk = require('@aws-cdk/core');
const cognito = require('@aws-cdk/aws-cognito');

class CognitoCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ID = id;
    const USERPOOL_NAME = `${ID}UserPool`;
    const USERPOOL_CLIENT_NAME = `${USERPOOL_NAME}Client`;
    const IDENTITY_POOL_NAME = `${ID}IdentityPool`;

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

      return identity_pool;
    }

    const user_pool = add_user_pool();
    const user_pool_client = add_user_pool_client(user_pool);
    add_identity_pool(user_pool, user_pool_client);
  }
}

module.exports = { CognitoCdkStack }
