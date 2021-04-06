import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CropperExampleRoutingModule } from './cropper-example-routing.module';
import { CropperExampleComponent } from './cropper-example/cropper-example.component';


@NgModule({
  declarations: [
    CropperExampleComponent
  ],
  imports: [
    CommonModule,
    CropperExampleRoutingModule
  ]
})
export class CropperExampleModule { }
