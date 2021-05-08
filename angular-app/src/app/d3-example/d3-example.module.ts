import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { D3ExampleRoutingModule } from './d3-example-routing.module';
import { D3ExampleComponent } from './components/d3-example.component';


@NgModule({
  declarations: [
    D3ExampleComponent
  ],
  imports: [
    CommonModule,
    D3ExampleRoutingModule
  ]
})
export class D3ExampleModule { }
