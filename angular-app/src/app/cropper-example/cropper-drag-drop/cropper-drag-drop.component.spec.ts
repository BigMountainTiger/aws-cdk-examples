import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperDragDropComponent } from './cropper-drag-drop.component';

describe('CropperDragDropComponent', () => {
  let component: CropperDragDropComponent;
  let fixture: ComponentFixture<CropperDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropperDragDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CropperDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
