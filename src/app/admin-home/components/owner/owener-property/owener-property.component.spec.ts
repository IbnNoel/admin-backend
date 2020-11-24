import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwenerPropertyComponent } from './owener-property.component';

describe('OwenerPropertyComponent', () => {
  let component: OwenerPropertyComponent;
  let fixture: ComponentFixture<OwenerPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwenerPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwenerPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
