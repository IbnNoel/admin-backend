import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditRefDataComponent } from './view-edit-ref-data.component';

describe('ViewEditRefDataComponent', () => {
  let component: ViewEditRefDataComponent;
  let fixture: ComponentFixture<ViewEditRefDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEditRefDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditRefDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
