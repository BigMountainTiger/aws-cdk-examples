// https://medium.com/@prasadjay/amazon-cognito-user-pools-in-nodejs-as-fast-as-possible-22d586c5c8ec
// https://stackoverflow.com/questions/52350509/aws-cognito-authentication-returns-error-javascript-sdk

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');


const REGION = 'us-east-1';
const USER_POOL_ID = 'us-east-1_ugjNr5pcN';
const USER_POOL_CLIENT_ID = 'd7mqhchjru0tvl9e0fht1ttdt';

const USER = 'song';
const PASSWORD = 'Password123';

AWS.config.update({
  region: REGION
});

const poolData = {    
  UserPoolId : USER_POOL_ID, 
  ClientId : USER_POOL_CLIENT_ID
}; 
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


const login = () => {
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({ Username: USER, Password: PASSWORD, });
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username: USER, Pool: userPool });

  const callback = {
    onSuccess: (result) => {
      const data = {
        access_token: result.getAccessToken().getJwtToken(),
        id_token: result.getIdToken().getJwtToken(),
        refresh_token: result.getRefreshToken().getToken()
      }

      console.log(data);
    },
    onFailure: (err) => {
        console.log(err);
    },
    newPasswordRequired: (userAttributes) => {
      //console.log(userAttributes);
      delete userAttributes.email_verified;
      cognitoUser.completeNewPasswordChallenge(PASSWORD, userAttributes, callback);
    }
  }

  cognitoUser.authenticateUser(authenticationDetails, callback);
};

login();

