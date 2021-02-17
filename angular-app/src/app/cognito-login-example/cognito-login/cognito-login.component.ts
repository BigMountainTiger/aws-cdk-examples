// https://docs.amazonaws.cn/en_us/cognito/latest/developerguide/token-endpoint.html

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

declare let JSONEditor: any

@Component({
  selector: 'app-cognito-login',
  templateUrl: './cognito-login.component.html',
  styleUrls: ['./cognito-login.component.css']
})
export class CognitoLoginComponent implements OnInit, AfterViewInit {

  @ViewChild('JEditor') jEditorRef;
  private jEditor = null;

  constructor() { }

  ngAfterViewInit(): void {
    let jEditor = new JSONEditor(this.jEditorRef.nativeElement, {mode: 'code'});

    jEditor.setText('');
    (document.getElementsByClassName('jsoneditor-poweredBy')[0] as HTMLElement).style.visibility = 'hidden';
    (document.getElementsByClassName('ace_editor ace_hidpi ace-jsoneditor')[0] as HTMLElement).style.fontSize = '13px';

    this.jEditor = jEditor;
  }

  ngOnInit(): void {}

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

  async onGetToken() {
    const USER = 'song';
    const PASSWORD = 'Password123';

    let jEditor = this.jEditor;

    jEditor.setText('');
    const token = await this.login(USER, PASSWORD);

    if (jEditor) {
      jEditor.set(token);
      
    }
  }

  async onClear() {
    this.jEditor.setText('');
  }

}
