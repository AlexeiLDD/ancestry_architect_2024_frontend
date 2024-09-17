import { TestBed } from '@angular/core/testing';

import { LoginRequiredService } from './login-required.service';

describe('LoginRequiredService', () => {
  let service: LoginRequiredService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginRequiredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
