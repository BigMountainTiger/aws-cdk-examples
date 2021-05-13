import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashFullComponent } from './dash-full.component';

describe('DashFullComponent', () => {
  let component: DashFullComponent;
  let fixture: ComponentFixture<DashFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashFullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
