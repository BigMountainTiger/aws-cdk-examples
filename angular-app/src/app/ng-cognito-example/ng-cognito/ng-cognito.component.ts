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

    let a = await Auth.signIn(USER, PASSWORD);

    console.log(a);
  }

}
