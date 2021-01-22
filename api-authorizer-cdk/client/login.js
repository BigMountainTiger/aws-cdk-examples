const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');

const USER_POOL_ID = 'us-east-1_ZJiWLU2Bs';
const USER_POOL_CLIENT_ID = '36edd75083nn27fptjbe4d38u';

const USER = 'song';
const PASSWORD = 'Password123';

const poolData = {
  UserPoolId : USER_POOL_ID, 
  ClientId : USER_POOL_CLIENT_ID
}; 
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const login = async () => {
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({ Username: USER, Password: PASSWORD, });
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username: USER, Pool: userPool });

  const p = new Promise((rs, rj) => {
    const callback = {
      onSuccess: (result) => {
        const data = {
          access_token: result.getAccessToken().getJwtToken(),
          id_token: result.getIdToken().getJwtToken(),
          refresh_token: result.getRefreshToken().getToken()
        }
  
        rs(data);
      },
      onFailure: (e) => { rj(e); },
      newPasswordRequired: (userAttributes) => {
        delete userAttributes.email_verified;
        cognitoUser.completeNewPasswordChallenge(PASSWORD, userAttributes, callback);
      }
    }
  
    cognitoUser.authenticateUser(authenticationDetails, callback);

  });

  return await p;
};


(async () => {

  try {

    const token = await login();
    console.log(token);
  } catch(e) {
    
    console.log(e);
  }
  
})();

console.log('Initialized ...');
