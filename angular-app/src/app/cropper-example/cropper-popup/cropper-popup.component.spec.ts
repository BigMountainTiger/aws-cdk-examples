import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperPopupComponent } from './cropper-popup.component';

describe('CropperPopupComponent', () => {
  let component: CropperPopupComponent;
  let fixture: ComponentFixture<CropperPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropperPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CropperPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
