import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CropperExampleRoutingModule } from './cropper-example-routing.module';
import { CropperExampleComponent } from './cropper-example/cropper-example.component';
import { CropperPopupComponent } from './cropper-popup/cropper-popup.component';
import { CropperDragDropComponent } from './cropper-drag-drop/cropper-drag-drop.component';
import { JustPopupComponent } from './just-popup/just-popup.component';


@NgModule({
  declarations: [
    CropperExampleComponent,
    CropperPopupComponent,
    CropperDragDropComponent,
    JustPopupComponent
  ],
  imports: [
    CommonModule,
    CropperExampleRoutingModule
  ]
})
export class CropperExampleModule { }
