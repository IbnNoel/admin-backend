import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOwnerDetailComponent } from './view-owner-detail.component';

describe('ViewOwnerDetailComponent', () => {
  let component: ViewOwnerDetailComponent;
  let fixture: ComponentFixture<ViewOwnerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOwnerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOwnerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
