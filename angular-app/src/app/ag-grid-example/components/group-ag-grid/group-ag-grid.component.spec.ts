import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAgGridComponent } from './group-ag-grid.component';

describe('GroupAgGridComponent', () => {
  let component: GroupAgGridComponent;
  let fixture: ComponentFixture<GroupAgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupAgGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
