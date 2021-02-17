import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCognitoComponent } from './ng-cognito.component';

describe('NgCognitoComponent', () => {
  let component: NgCognitoComponent;
  let fixture: ComponentFixture<NgCognitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgCognitoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgCognitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
