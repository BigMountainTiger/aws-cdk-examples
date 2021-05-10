import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashGaugeComponent } from './dash-gauge.component';

describe('DashGaugeComponent', () => {
  let component: DashGaugeComponent;
  let fixture: ComponentFixture<DashGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashGaugeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
