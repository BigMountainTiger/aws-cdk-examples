const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
global.fetch = require('node-fetch');

const REGION = 'us-east-1';
const USER_POOL_ID = 'us-east-1_qzRHIZK9W';
const USER_POOL_CLIENT_ID = '76fduugu2k2pk86ho3l94mf2ju';
const IDENTITY_POOL_ID = 'us-east-1:79400f5a-1321-45d9-8345-84bf45996d20';
const IDENTITY_PROVIDER_NAME = 'cognito-idp.us-east-1.amazonaws.com/us-east-1_qzRHIZK9W'

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

  AWS.config.region = REGION;
  const credential = {
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: {}
  };
  credential.Logins[IDENTITY_PROVIDER_NAME] = token.id_token;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(credential);

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


