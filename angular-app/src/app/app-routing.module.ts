import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [

  { path: '', redirectTo: '/cognito-login-example', pathMatch: 'full' },

  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  
  { 
    path: 'cognito-login-example',
    loadChildren: () => import('./cognito-login-example/cognito-login-example.module').then(m => m.CognitoLoginExampleModule),
    canActivate: [AuthGuardService]
  },

  { 
    path: 'ng-cognito-example', 
    loadChildren: () => import('./ng-cognito-example/ng-cognito-example.module').then(m => m.NgCognitoExampleModule),
    canActivate: [AuthGuardService]
  },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SharedModule],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
