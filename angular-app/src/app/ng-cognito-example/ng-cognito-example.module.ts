import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgCognitoExampleRoutingModule } from './ng-cognito-example-routing.module';
import { NgCognitoComponent } from './ng-cognito/ng-cognito.component';


@NgModule({
  declarations: [NgCognitoComponent],
  imports: [
    CommonModule,
    NgCognitoExampleRoutingModule
  ]
})
export class NgCognitoExampleModule { }
