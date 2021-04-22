import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleComponentComponent } from './example-component/example-component.component';

@NgModule({
  declarations: [
    ExampleComponentComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ExampleComponentComponent
  ]
})
export class AnExampleModuleModule { }
