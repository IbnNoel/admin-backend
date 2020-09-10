import { TestBed } from '@angular/core/testing';

import { PropertyNewsService } from './property-news.service';

describe('PropertyNewsService', () => {
  let service: PropertyNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
