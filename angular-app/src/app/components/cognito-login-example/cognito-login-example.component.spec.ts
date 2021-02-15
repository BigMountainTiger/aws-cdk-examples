import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CognitoLoginExampleComponent } from './cognito-login-example.component';

describe('CognitoLoginExampleComponent', () => {
  let component: CognitoLoginExampleComponent;
  let fixture: ComponentFixture<CognitoLoginExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CognitoLoginExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CognitoLoginExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
