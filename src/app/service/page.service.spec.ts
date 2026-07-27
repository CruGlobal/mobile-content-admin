import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { AuthService } from './auth/auth.service';
import {
  MockAuthService,
  requestHasAuthenticatedHeaders,
} from './auth/mockAuthService';
import { PageService } from './page.service';

describe('PageService', () => {
  let service: PageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PageService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    service = TestBed.inject(PageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('update sends structure and filename attributes', (done) => {
    service
      .update(7, { structure: '<page/>', filename: 'renamed.xml' })
      .then((page) => {
        expect(page.id).toEqual(7);
        expect(page.filename).toEqual('renamed.xml');
        done();
      });

    const req = httpMock.expectOne(`${environment.base_url}pages/7`);
    expect(req.request.method).toBe('PUT');
    requestHasAuthenticatedHeaders(req);
    expect(req.request.body.data.attributes).toEqual({
      structure: '<page/>',
      filename: 'renamed.xml',
    });
    req.flush({
      data: { id: 7, type: 'page', attributes: { filename: 'renamed.xml' } },
    });
  });

  it('update sends only the provided attributes', () => {
    service.update(7, { structure: '<page/>' });

    const req = httpMock.expectOne(`${environment.base_url}pages/7`);
    requestHasAuthenticatedHeaders(req);
    expect(req.request.body.data.attributes).toEqual({
      structure: '<page/>',
    });
  });

  it('update rejects with the API error detail', (done) => {
    service.update(7, { filename: 'dupe.xml' }).catch((message) => {
      expect(message).toBe(
        'Validation failed: Filename has already been taken',
      );
      done();
    });

    const req = httpMock.expectOne(`${environment.base_url}pages/7`);
    req.flush(
      {
        errors: [
          { detail: 'Validation failed: Filename has already been taken' },
        ],
      },
      { status: 400, statusText: 'Bad Request' },
    );
  });

  it('reorder posts the ordered page ids to the resource reorder endpoint', () => {
    service.reorder(13, [3, 1, 2]);

    const req = httpMock.expectOne(
      `${environment.base_url}resources/13/pages/reorder`,
    );
    expect(req.request.method).toBe('POST');
    requestHasAuthenticatedHeaders(req);
    expect(req.request.body.data.attributes).toEqual({ page_ids: [3, 1, 2] });
    req.flush({ data: [] });
  });
});
