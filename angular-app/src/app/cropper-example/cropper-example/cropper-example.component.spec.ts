import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperExampleComponent } from './cropper-example.component';

describe('CropperExampleComponent', () => {
  let component: CropperExampleComponent;
  let fixture: ComponentFixture<CropperExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropperExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CropperExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
