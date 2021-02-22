import { Component, OnInit } from '@angular/core';
import { Auth, Amplify } from "aws-amplify";

@Component({
  selector: 'app-ng-cognito',
  templateUrl: './ng-cognito.component.html',
  styleUrls: ['./ng-cognito.component.css']
})
export class NgCognitoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    Amplify.configure({
      Auth: {
          region: "us-east-1",
          userPoolId: "us-east-1_n37H054sQ",
          userPoolWebClientId: "1pd3ri7i655lk7bo39e3bppn23"
      }
    });
  }

  async onGetToken() {
    const USER = 'song';
    const PASSWORD = 'Password123';

    try {
      
      await Auth.signIn(USER, PASSWORD);
      console.log('Login succeeded');
    }
    catch(e) {
      
      console.log('Login failed');
      console.log(e);
    }
  }

  async onRefresh() {
    let user = await Auth.currentAuthenticatedUser();
    let session = user.signInUserSession;

    let refresh_token = session.refreshToken;

    let p = new Promise((rs, rj) => {
      user.refreshSession(refresh_token, (err, session) => { if (err) { rj(err); } rs(session); });
    });
    
    try {

      session = await p;
      console.log(session);
    }
    catch(e) {
      console.log(e);
    }

  }

  async onCheckAuth() {
    let user = await Auth.currentAuthenticatedUser();
    let session = user.signInUserSession;
    let id_token = session.idToken;

    console.log(user);
    console.log(session);
    console.log(id_token);

    console.log(id_token.payload.exp);

    let unix_now = Date.now();
    console.log(`Unix now - ${unix_now}`);
  }

}
