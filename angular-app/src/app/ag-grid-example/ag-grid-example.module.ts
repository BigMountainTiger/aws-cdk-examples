import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridExampleRoutingModule } from './ag-grid-example-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridComponent } from './components/ag-grid/ag-grid.component';
import { ContainerComponent } from './components/container/container.component';

@NgModule({
  declarations: [AgGridComponent, ContainerComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    AgGridExampleRoutingModule
  ]
})
export class AgGridExampleModule { }
