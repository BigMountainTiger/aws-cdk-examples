import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CognitoLoginComponent } from './cognito-login/cognito-login.component';

const routes: Routes = [{ path: '', component: CognitoLoginComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CognitoLoginExampleRoutingModule { }
