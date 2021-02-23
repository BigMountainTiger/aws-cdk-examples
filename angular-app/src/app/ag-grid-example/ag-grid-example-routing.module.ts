import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgGridComponent } from './ag-grid/ag-grid.component';

const routes: Routes = [{ path: '', component: AgGridComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgGridExampleRoutingModule { }
