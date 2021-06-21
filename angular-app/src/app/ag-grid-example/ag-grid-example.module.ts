import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridExampleRoutingModule } from './ag-grid-example-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridComponent } from './components/ag-grid/ag-grid.component';
import { ContainerComponent } from './components/container/container.component';
import { GroupAgGridComponent } from './components/group-ag-grid/group-ag-grid.component';

@NgModule({
  declarations: [AgGridComponent, ContainerComponent, GroupAgGridComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    AgGridExampleRoutingModule
  ]
})
export class AgGridExampleModule { }
