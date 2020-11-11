import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCountryListComponent } from './add-country-list.component';

describe('AddCountryListComponent', () => {
  let component: AddCountryListComponent;
  let fixture: ComponentFixture<AddCountryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCountryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCountryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
