import { TestBed } from '@angular/core/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';
import { UserAuthSessionService } from './user-auth-session.service';

describe('UserAuthSessionService', () => {
  let service: UserAuthSessionService;
  const oauthServiceStub = {
    logOut(_noRedirect?: boolean) {},
  };
  const authServiceStub = {
    clearAuthToken() {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserAuthSessionService,
        { provide: OAuthService, useValue: oauthServiceStub },
        { provide: AuthService, useValue: authServiceStub },
      ],
    });

    service = TestBed.inject(UserAuthSessionService);
  });

  describe('clearSavedUserSessionData', () => {
    it('clears the stored app auth token', () => {
      spyOn(authServiceStub, 'clearAuthToken');

      service.clearSavedUserSessionData();

      expect(authServiceStub.clearAuthToken).toHaveBeenCalled();
    });

    it('clears the OIDC tokens without redirecting to the logout endpoint', () => {
      spyOn(oauthServiceStub, 'logOut');

      service.clearSavedUserSessionData();

      expect(oauthServiceStub.logOut).toHaveBeenCalledWith();
    });
  });
});
