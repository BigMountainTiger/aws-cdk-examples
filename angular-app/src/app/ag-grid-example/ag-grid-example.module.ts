import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridExampleRoutingModule } from './ag-grid-example-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridComponent } from './ag-grid/ag-grid.component';

@NgModule({
  declarations: [AgGridComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    AgGridExampleRoutingModule
  ]
})
export class AgGridExampleModule { }
