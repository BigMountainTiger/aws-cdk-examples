import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [

  { path: '', redirectTo: '/cognito-login-example', pathMatch: 'full' },
  { path: 'cognito-login-example',
    loadChildren: () => import('./cognito-login-example/cognito-login-example.module').then(m => m.CognitoLoginExampleModule) },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [PageNotFoundComponent]
})
export class AppRoutingModule { }
