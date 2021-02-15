import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CognitoLoginExampleComponent } from './components/cognito-login-example/cognito-login-example.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [

  { path: '', redirectTo: '/cognito-login-example', pathMatch: 'full' },
  { path: 'cognito-login-example', component: CognitoLoginExampleComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [CognitoLoginExampleComponent, PageNotFoundComponent]
})
export class AppRoutingModule { }
