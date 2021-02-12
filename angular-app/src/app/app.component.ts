// https://docs.amazonaws.cn/en_us/cognito/latest/developerguide/token-endpoint.html

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-app';

  onTest() {
    const USER_POOL_ID = 'us-east-1_n37H054sQ';
    const USER_POOL_CLIENT_ID = '1pd3ri7i655lk7bo39e3bppn23';
    const USER = 'song';
    const PASSWORD = 'Password123';

    const poolData = {    
      UserPoolId : USER_POOL_ID, 
      ClientId : USER_POOL_CLIENT_ID
    }; 



    alert('OK');
  }
}
