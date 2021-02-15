import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CognitoLoginExampleComponent } from './components/cognito-login-example/cognito-login-example.component';

const routes: Routes = [

  { path: 'cognito-login-example', component: CognitoLoginExampleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [CognitoLoginExampleComponent]
})
export class AppRoutingModule { }
