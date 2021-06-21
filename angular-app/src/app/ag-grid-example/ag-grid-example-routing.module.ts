import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgGridComponent } from './components/ag-grid/ag-grid.component';
import { ContainerComponent } from './components/container/container.component';
import { GroupAgGridComponent } from './components/group-ag-grid/group-ag-grid.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      {
        path: 'simple',
        component: AgGridComponent
      },
      {
        path: 'group',
        component: GroupAgGridComponent
      },
      {
        path: '**',
        redirectTo: 'simple'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgGridExampleRoutingModule { }
