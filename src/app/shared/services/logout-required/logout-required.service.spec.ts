import { TestBed } from '@angular/core/testing';

import { LogoutRequiredService } from './logout-required.service';

describe('LogoutRequiredService', () => {
  let service: LogoutRequiredService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogoutRequiredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
