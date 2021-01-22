// https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
// https://aws.amazon.com/premiumsupport/knowledge-center/decode-verify-cognito-json-token/

const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');

const USER_POOL_ID = 'us-east-1_LbEhHLGZx';
const USER_POOL_CLIENT_ID = '5rckjk0deivrs2j9le07a3h2mr';

const USER = 'song';
const PASSWORD = 'Password123';

const poolData = {};
poolData.UserPoolId = USER_POOL_ID;
poolData.ClientId = USER_POOL_CLIENT_ID;

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

  let token = null;
  try {

    token = await login();
  } catch(e) {

    console.log(e);
    return;
  }

  const id_token = token.id_token;

  // const id_token = 'eyJraWQiOiJKMWRWRUg2NXJCMndNMmVHM1FRUFFyY0tReEN2V1lLRlhcL1R4eUtxR1gzRT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0MmZhMTI5OS0zMjNiLTRhMmUtOGYzZC0xNzRhNDE1ZGUxNjEiLCJhdWQiOiI1cmNramswZGVpdnJzMmo5bGUwN2EzaDJtciIsImV2ZW50X2lkIjoiNzI2MjdmZDAtMTkzNS00YTUxLThhNjItYzZkODk0MzA0ZDFjIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MTEzNDczMTMsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0xiRWhITEdaeCIsImNvZ25pdG86dXNlcm5hbWUiOiJzb25nIiwiZXhwIjoxNjExMzUwOTEzLCJpYXQiOjE2MTEzNDczMTN9.h1Zaf7dV19aYIKrYarZUMzqJUEMaQesT4KPN5YfjDOQr-d2tKJ5S0aR0Mbu0if2NwTZxjJpog2YDqBSFJRQUidCDiaLqBinw7mldvzipEugIB0yxub7ZNuF_P0VMFnVDZgkiqSl8PQMAvlkwVa1TeXSk96u9Mf975O0ne9uAr-j2X5NeTPBAfToqlobZYklme-N8Z6yOxOepoCc_L8HaEwx-AUTyPssMpaBLPcK2BewyegdImLI4yWvMV6HVqy0H2K6rZOuPZh-GnqAJ-JiO8HYx0nA7t-x0p39HMQSERPwcXuCyQjXBTbMRazWch7Q6d4SSnUdfHCUVvUvHo5jJ4w';
  console.log(id_token);

  const sections = id_token.split('.');
  const header = JSON.parse(Buffer.from(sections[0], 'base64').toString('utf-8'));
  console.log(header);

  const payload = JSON.parse(Buffer.from(sections[1], 'base64').toString('utf-8'));
  console.log(payload);

  const signature = Buffer.from(sections[2], 'base64');
  console.log(signature);

  const key = '{"keys":[{"alg":"RS256","e":"AQAB","kid":"J1dVEH65rB2wM2eG3QQPQrcKQxCvWYKFX/TxyKqGX3E=","kty":"RSA","n":"vx61ukDTheNjWJyr5sPVgW_s5DIPtpFBFo2vDRwDVS4z2icm-QLkoPBbTnMhGycAq7E-QcpgvawEZd08AqhPld_3M3ACpjk-OnKRTlsm4MjAE-KSQxZfudWyEy8QI8muKyN-93v5k9D6dQuG2qzZ2HMZWvD8i5WSVqLvlYQxV4Wj0kaWNpJjCR6_3NXCS80LdmrQzKvVJiA0RZR3gPvvk4bodYsjiJEtVv5sn7H8StPMawseFosg7b14Fhw3vYIYSGugdqTZ8o__NQ30ymLw4P2uENnRxXcLgN29IivEX-B3piMKxAou_mmJbiuRJ1pTQvuiwVQMQNY69NC8eXzhxw","use":"sig"},{"alg":"RS256","e":"AQAB","kid":"YbE+k8+05PX7PxPHKmAmQlJGWYhmsUkHkycv6Agq1/Y=","kty":"RSA","n":"2YCZIy75BTd0OmGX7exN69k0mwqLhqr9tAUnSpTij_qAww8WTfQCJ-WHeT-inKYu1Ysfp5_YhA8TwVRjoSlSfA6FmulHKcYapc0Ipm2qwUu5I0-a7rS6behlYcmkq-kn8sudOTG7TTsvR5kwUohCs10TWXjJr9WvX0ySxOW13Y6Bp3qTOOQmzQoCI43f3dmJURVxJRgQwFMM9TXhRnDf7pT1ej3c7a2zS9oW5rddOkb58To2eYECPRX2cOSv2aeVjTDjpP-qr2gZxtPz77aC_u_pl5Kzq_0trMTJIUXz0WLEP5WrgVN1bLKRqeMrkk0LKG40huPF8FpGq17IB4qCZQ","use":"sig"}]}';
  let pem = jwkToPem(JSON.parse(key)['keys'][0]);
  jwt.verify(id_token, pem, { algorithms: ['RS256'] }, function(err, decodedToken) {

    console.log(err);
    console.log(decodedToken);
  });

})();

console.log('Initialized ...');
