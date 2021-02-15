// https://docs.amazonaws.cn/en_us/cognito/latest/developerguide/token-endpoint.html

import { Component, OnInit } from '@angular/core';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

@Component({
  selector: 'app-cognito-login-example',
  templateUrl: './cognito-login-example.component.html',
  styleUrls: ['./cognito-login-example.component.css']
})
export class CognitoLoginExampleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  async login(user, pwd) {
    const USER_POOL_ID = 'us-east-1_n37H054sQ';
    const USER_POOL_CLIENT_ID = '1pd3ri7i655lk7bo39e3bppn23';
    let USER = user;
    let PASSWORD = pwd;

    const poolData = {    
      UserPoolId : USER_POOL_ID, 
      ClientId : USER_POOL_CLIENT_ID
    }; 

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
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
        onFailure: (e) => { 
          rj(e);
        },
        newPasswordRequired: (userAttributes) => {
          delete userAttributes.email_verified;
          cognitoUser.completeNewPasswordChallenge(PASSWORD, userAttributes, callback);
        }
      }

      cognitoUser.authenticateUser(authenticationDetails, callback);
    });

    return await p;
  }

  async onTest() {
    const USER = 'song';
    const PASSWORD = 'Password123';

    const token = await this.login(USER, PASSWORD);
    console.log(token);
  }

}
