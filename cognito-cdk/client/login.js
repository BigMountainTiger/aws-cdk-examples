const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
global.fetch = require('node-fetch');


const USER_POOL_ID = 'us-east-1_50wBjc9L7';
const USER_POOL_CLIENT_ID = '3719k34k2qgfdi4238eim58gn0';

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
        //console.log(userAttributes);
        delete userAttributes.email_verified;
        cognitoUser.completeNewPasswordChallenge(PASSWORD, userAttributes, callback);
      }
    }
  
    cognitoUser.authenticateUser(authenticationDetails, callback);
  });

  return await p;
};


(async () => {
  const token = await login();
  console.log(token);

  AWS.config.region = 'us-east-1';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:f8395a2b-e83b-4048-9c11-41c89bd3e2a5',
    Logins: {
      "cognito-idp.us-east-1.amazonaws.com/us-east-1_50wBjc9L7": token.id_token
    }
  });

  AWS.config.credentials.get(function(err, data){
    if (err) { console.log(err); }

    const identities = {
      accessKeyId: AWS.config.credentials.accessKeyId,
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken
    };
    
    console.log(identities);
  });

})();

console.log('Initialized ...');


