import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeePostInfoComponent } from './see-post-info.component';

describe('SeePostInfoComponent', () => {
  let component: SeePostInfoComponent;
  let fixture: ComponentFixture<SeePostInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeePostInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeePostInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
