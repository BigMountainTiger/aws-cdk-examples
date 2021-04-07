import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CropperExampleRoutingModule } from './cropper-example-routing.module';
import { CropperExampleComponent } from './cropper-example/cropper-example.component';
import { CropperPopupComponent } from './cropper-popup/cropper-popup.component';
import { CropperDragDropComponent } from './cropper-drag-drop/cropper-drag-drop.component';


@NgModule({
  declarations: [
    CropperExampleComponent,
    CropperPopupComponent,
    CropperDragDropComponent
  ],
  imports: [
    CommonModule,
    CropperExampleRoutingModule
  ]
})
export class CropperExampleModule { }
