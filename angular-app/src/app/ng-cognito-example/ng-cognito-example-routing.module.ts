import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgCognitoComponent } from './ng-cognito/ng-cognito.component';

const routes: Routes = [{ path: '', component: NgCognitoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgCognitoExampleRoutingModule { }
