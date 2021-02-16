import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CognitoLoginExampleRoutingModule } from './cognito-login-example-routing.module';
import { CognitoLoginComponent } from './cognito-login/cognito-login.component';

@NgModule({
  declarations: [CognitoLoginComponent],
  imports: [
    CommonModule,
    CognitoLoginExampleRoutingModule
  ]
})
export class CognitoLoginExampleModule { }
