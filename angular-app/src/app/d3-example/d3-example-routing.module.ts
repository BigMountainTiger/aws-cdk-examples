import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { D3ExampleComponent } from './components/d3-example/d3-example.component';

const routes: Routes = [{ path: '', component: D3ExampleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class D3ExampleRoutingModule { }
