import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRefDataComponent } from './edit-ref-data.component';

describe('EditRefDataComponent', () => {
  let component: EditRefDataComponent;
  let fixture: ComponentFixture<EditRefDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRefDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRefDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
