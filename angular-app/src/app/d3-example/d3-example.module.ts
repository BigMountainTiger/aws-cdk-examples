import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { D3ExampleRoutingModule } from './d3-example-routing.module';
import { D3ExampleComponent } from './components/d3-example/d3-example.component';
import { DashGaugeComponent } from './components/dash-gauge/dash-gauge.component';
import { DashFullComponent } from './components/dash-full/dash-full/dash-full.component';


@NgModule({
  declarations: [
    D3ExampleComponent,
    DashGaugeComponent,
    DashFullComponent
  ],
  imports: [
    CommonModule,
    D3ExampleRoutingModule
  ]
})
export class D3ExampleModule { }
