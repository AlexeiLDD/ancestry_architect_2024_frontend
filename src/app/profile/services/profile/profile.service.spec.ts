import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    });
    
    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get profile', (done) => {
    const id = 1;
    const mockResponse: any = { id: 1, name: 'Test User' };

    service.getProfile(id).subscribe(
      response => {
        expect(response).toEqual(mockResponse);
        done();
      }
    );

    const req = httpMock.expectOne(`${service.baseURL}profile/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should update profile', (done) => {
    const mockFormData = new FormData();
    mockFormData.append('name', 'Updated Name');

    const mockResponse: any = { message: 'Profile updated successfully' };

    service.updateProfile(mockFormData).subscribe(
      response => {
        expect(response).toEqual(mockResponse);
        done();
      }
    );

    const req = httpMock.expectOne(`${service.baseURL}profile`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFormData);
    req.flush(mockResponse);
  });
});
