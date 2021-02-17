import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [

  { path: '', redirectTo: '/cognito-login-example', pathMatch: 'full' },
  { path: 'cognito-login-example',
    loadChildren: () => import('./cognito-login-example/cognito-login-example.module').then(m => m.CognitoLoginExampleModule) },

  { path: 'ng-cognito-example', loadChildren: () => import('./ng-cognito-example/ng-cognito-example.module').then(m => m.NgCognitoExampleModule) },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SharedModule],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
