// https://medium.com/@prasadjay/amazon-cognito-user-pools-in-nodejs-as-fast-as-possible-22d586c5c8ec
// https://stackoverflow.com/questions/52350509/aws-cognito-authentication-returns-error-javascript-sdk
// https://docs.aws.amazon.com/cognito/latest/developerguide/getting-credentials.html
// https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html
// https://docs.amplify.aws/lib/auth/getting-started/q/platform/android


const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
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

        AWS.config.region = 'us-east-1';

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-1:7cd9b1ee-3d29-4b6a-a01c-bf8727b717a1',
          Logins: {
            "cognito-idp:us-east-1.amazonaws.com/us-east-1_k1nsaNC2O": data.id_token
          }
        });

        console.log(AWS.config.credentials);

        AWS.config.credentials.get(function(err, data){
          console.log(err);

          const accessKeyId = AWS.config.credentials.accessKeyId;
          const secretAccessKey = AWS.config.credentials.secretAccessKey;
          const sessionToken = AWS.config.credentials.sessionToken;

          console.log(accessKeyId);
          console.log(secretAccessKey);
          console.log(sessionToken);
        });
  
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


const loginSession = async () => {
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

  await p;
  cognitoUser.getSession(function(err, result) {

    console.log(result);
    AWS.config.region = 'us-east-1';

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      AccountId: '005256505030',
      IdentityPoolId: 'us-east-1:f8395a2b-e83b-4048-9c11-41c89bd3e2a5',
      Logins: {
        "cognito-idp.us-east-1.amazonaws.com/us-east-1_50wBjc9L7": result.getIdToken().getJwtToken()
      }
    });

    console.log(AWS.config.credentials);

    AWS.config.credentials.get(function(err){
      console.log(err);

      const token = {
        accessKeyId: AWS.config.credentials.accessKeyId,
        secretAccessKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken
      };

      console.log(token);
    });
  });
};

(async () => {
  await loginSession();

  // const token = await login();
  // console.log(token);

  // arn:aws:cognito-idp:us-east-1:005256505030:userpool/us-east-1_k1nsaNC2O
  // cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>
  // us-east-1_k1nsaNC2O
  // AWS.config.region = 'us-east-1';

  // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  //   IdentityPoolId: 'us-east-1:7cd9b1ee-3d29-4b6a-a01c-bf8727b717a1',
  //   Logins: {
  //     "cognito-idp:us-east-1.amazonaws.com/us-east-1_k1nsaNC2O": token.refresh_token
  //   }
  // });

  // console.log(AWS.config.credentials);

  // AWS.config.credentials.get(function(err, data){
  //   console.log(err);

  //   const accessKeyId = AWS.config.credentials.accessKeyId;
  //   const secretAccessKey = AWS.config.credentials.secretAccessKey;
  //   const sessionToken = AWS.config.credentials.sessionToken;

  //   console.log(accessKeyId);
  //   console.log(secretAccessKey);
  //   console.log(sessionToken);
  // });

})();

console.log('Initialized ...');


