import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CropperExampleComponent } from './cropper-example/cropper-example.component';

const routes: Routes = [{ path: '', component: CropperExampleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CropperExampleRoutingModule { }
