import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UUID } from 'angular2-uuid';
import { environment } from '../../../environments/environment';
import { WindowRefService } from '../../models/window-ref-service';
import { AuthRefreshInterceptor } from './auth-refresh.interceptor';
import { AuthService } from './auth.service';

describe('AuthRefreshInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let windowRef: WindowRefService;

  const apiUrl = environment.base_url + 'resources';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        WindowRefService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthRefreshInterceptor,
          multi: true,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    windowRef = TestBed.inject(WindowRefService);
  });

  afterEach(() => {
    httpMock.verify();
    windowRef.nativeWindow.localStorage.clear();
  });

  it('stores a refreshed token from the Authorization response header of an active session', () => {
    windowRef.nativeWindow.localStorage.setItem('Authorization', UUID.UUID());
    const refreshed = UUID.UUID();

    http.get(apiUrl).subscribe();

    httpMock
      .expectOne(apiUrl)
      .flush({}, { headers: { Authorization: refreshed } });

    expect(windowRef.nativeWindow.localStorage.getItem('Authorization')).toBe(
      refreshed,
    );
  });

  it('leaves the stored token untouched when no Authorization header is present', () => {
    const existing = UUID.UUID();
    windowRef.nativeWindow.localStorage.setItem('Authorization', existing);

    http.get(apiUrl).subscribe();

    httpMock.expectOne(apiUrl).flush({});

    expect(windowRef.nativeWindow.localStorage.getItem('Authorization')).toBe(
      existing,
    );
  });

  it('does not resurrect a token after logout when no session is stored', () => {
    const refreshed = UUID.UUID();

    http.get(apiUrl).subscribe();

    httpMock
      .expectOne(apiUrl)
      .flush({}, { headers: { Authorization: refreshed } });

    expect(
      windowRef.nativeWindow.localStorage.getItem('Authorization'),
    ).toBeNull();
  });

  it('ignores Authorization headers from non-API (e.g. Okta) responses', () => {
    const existing = UUID.UUID();
    windowRef.nativeWindow.localStorage.setItem('Authorization', existing);
    const foreign = UUID.UUID();
    const oktaUrl = environment.oidc_auth.issuer + '/oauth2/token';

    http.get(oktaUrl).subscribe();

    httpMock
      .expectOne(oktaUrl)
      .flush({}, { headers: { Authorization: foreign } });

    expect(windowRef.nativeWindow.localStorage.getItem('Authorization')).toBe(
      existing,
    );
  });
});
