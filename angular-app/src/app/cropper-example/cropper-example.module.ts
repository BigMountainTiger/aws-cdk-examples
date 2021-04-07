import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CropperExampleRoutingModule } from './cropper-example-routing.module';
import { CropperExampleComponent } from './cropper-example/cropper-example.component';
import { CropperPopupComponent } from './cropper-popup/cropper-popup.component';


@NgModule({
  declarations: [
    CropperExampleComponent,
    CropperPopupComponent
  ],
  imports: [
    CommonModule,
    CropperExampleRoutingModule
  ]
})
export class CropperExampleModule { }
