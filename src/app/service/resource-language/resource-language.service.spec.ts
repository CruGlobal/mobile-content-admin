import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ResourceService } from '../resource/resource.service';
import { AuthService } from '../auth/auth.service';
import { Resource } from '../../models/resource';
import {
  MockAuthService,
  requestHasAuthenticatedHeaders,
} from '../auth/mockAuthService';

describe('ResourceService', () => {
  let service: ResourceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ResourceService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    service = TestBed.inject(ResourceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  const resource = new Resource();

  it('creating uses authorization code', () => {
    service.create(resource);

    const req = httpMock.expectOne((request) => {
      return request.method === 'POST' && request.headers.has('Authorization');
    });

    expect(req.request.method).toBe('POST');
    requestHasAuthenticatedHeaders(req);
  });

  it('updating uses authorization code', () => {
    service.update(resource);

    const req = httpMock.expectOne((request) => {
      return request.method === 'PUT' && request.headers.has('Authorization');
    });

    expect(req.request.method).toBe('PUT');
    requestHasAuthenticatedHeaders(req);
  });
});
