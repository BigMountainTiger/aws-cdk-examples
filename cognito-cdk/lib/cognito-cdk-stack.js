const cdk = require('@aws-cdk/core');
const cognito = require('@aws-cdk/aws-cognito');

class CognitoCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ID = id;
    const USERPOOL_NAME = `${ID}UserPool`;
    const USERPOOL_CLIENT_NAME = `${USERPOOL_NAME}Client`;

    const add_user_pool = () => {
      const pool = new cognito.UserPool(this, USERPOOL_NAME, {
        userPoolName: USERPOOL_NAME,
        passwordPolicy: {},
        userInvitation: {
          emailSubject: 'Invite to join our awesome app!',
          emailBody: 'Hello {username}, you have been invited to join our awesome app! Your temporary password is {####}',
          smsMessage: 'Hello {username}, your temporary password for our awesome app is {####}'
        }
      });

      return pool;
    };

    const pool = add_user_pool();

    pool.addClient(USERPOOL_CLIENT_NAME, {
      userPoolClientName: USERPOOL_CLIENT_NAME,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        refreshToken: true
      }
    });
  }
}

module.exports = { CognitoCdkStack }
