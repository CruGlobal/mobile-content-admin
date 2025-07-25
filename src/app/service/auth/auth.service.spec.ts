import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { WindowRefService } from '../../models/window-ref-service';
import { UUID } from 'angular2-uuid';
import { environment } from '../../../environments/environment';

const token = UUID.UUID();
const response = {
  data: {
    attributes: {
      token,
    },
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let windowRef: WindowRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, WindowRefService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    windowRef = TestBed.inject(WindowRefService);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
    // Clean up session storage
    windowRef.nativeWindow.sessionStorage.clear();
  });

  it('sets auth header', () => {
    windowRef.nativeWindow.sessionStorage.setItem('Authorization', token);

    const result = service.getAuthorizationAndOptions();

    expect(result.headers.get('Authorization')).toBe(token);
    expect(result.headers.get('Content-Type')).toBe('application/vnd.api+json');
  });

  it('saves auth code after successful authentication', async () => {
    const accessCode = 'test-access-code';
    const expectedUrl = environment.base_url + 'auth';

    const promise = service.createAuthToken(accessCode);

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toContain(accessCode);
    expect(req.request.headers.get('Content-Type')).toBe(
      'application/vnd.api+json',
    );

    req.flush(response);

    const result = await promise;
    expect(result.token).toBe(token);
    expect(windowRef.nativeWindow.sessionStorage.getItem('Authorization')).toBe(
      token,
    );
  });
});
