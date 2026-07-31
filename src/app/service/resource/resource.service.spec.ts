import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Resource } from '../../models/resource';
import { AuthService } from '../auth/auth.service';
import {
  MockAuthService,
  requestHasAuthenticatedHeaders,
} from '../auth/mockAuthService';
import { ResourceService } from './resource.service';

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
  resource.id = 13;

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

  it('updating sends the default language attribute', () => {
    const localizedResource = new Resource();
    localizedResource.id = 13;
    localizedResource['attr-default-locale'] = 'fr';

    service.update(localizedResource);

    const req = httpMock.expectOne((request) => request.method === 'PUT');
    expect(req.request.body.data.attributes['attr-default-locale']).toBe('fr');
  });

  it('updating sends a null default language attribute when unset', () => {
    const localizedResource = new Resource();
    localizedResource.id = 13;

    service.update(localizedResource);

    const req = httpMock.expectOne((request) => request.method === 'PUT');
    expect(req.request.body.data.attributes['attr-default-locale']).toBeNull();
  });

  it('updating sends null when the default language is cleared', () => {
    const localizedResource = new Resource();
    localizedResource.id = 13;
    // the blank <option value=""> in edit-resource.component.html yields '', not undefined
    localizedResource['attr-default-locale'] = '';

    service.update(localizedResource);

    const req = httpMock.expectOne((request) => request.method === 'PUT');
    expect(req.request.body.data.attributes['attr-default-locale']).toBeNull();
  });

  describe('GetResources()', () => {
    it('should include "include"', () => {
      const expectedUrl = `${environment.base_url}resources?include=test-data`;

      service.getResources('test-data');

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
    });

    it('should not include "include"', () => {
      const expectedUrl = `${environment.base_url}resources/${resource.id}`;

      service.getResource(resource.id);

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('GetResource()', () => {
    it('should include "include"', () => {
      const expectedUrl = `${environment.base_url}resources/${resource.id}?include=test-data`;

      service.getResource(resource.id, 'test-data');

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
    });

    it('should not include "include"', () => {
      const expectedUrl = `${environment.base_url}resources/${resource.id}`;

      service.getResource(resource.id);

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});
