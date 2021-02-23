import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridExampleRoutingModule } from './ag-grid-example-routing.module';
import { AgGridComponent } from './ag-grid/ag-grid.component';

@NgModule({
  declarations: [AgGridComponent],
  imports: [
    CommonModule,
    AgGridExampleRoutingModule
  ]
})
export class AgGridExampleModule { }
