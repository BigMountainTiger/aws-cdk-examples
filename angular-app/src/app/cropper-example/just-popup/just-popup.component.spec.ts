import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustPopupComponent } from './just-popup.component';

describe('JustPopupComponent', () => {
  let component: JustPopupComponent;
  let fixture: ComponentFixture<JustPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JustPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
