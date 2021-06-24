import { Injectable } from '@angular/core';
import { OAuthService, UserInfo } from 'angular-oauth2-oidc';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthToken } from '../../models/auth-token';
import { IOauthSessionCheckResult } from '../../models/oauth-session-check-result';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthSessionService {
  private _oauthUser: BehaviorSubject<UserInfo> = new BehaviorSubject<UserInfo>(
    { sub: '' },
  );
  private _erroredAt: BehaviorSubject<IOauthSessionCheckResult> = new BehaviorSubject<IOauthSessionCheckResult>(
    {
      hasValidSession: false,
    },
  );

  oauthSessionError$: Observable<IOauthSessionCheckResult> = this._erroredAt.asObservable();

  constructor(
    private _oauthService: OAuthService,
    private _authService: AuthService,
  ) {}

  checkOauthSession(): Observable<IOauthSessionCheckResult> {
    const tResult: IOauthSessionCheckResult = { hasValidSession: false };

    const tDicoveryDocObservable: Observable<boolean> = from(
      this._oauthService.loadDiscoveryDocumentAndTryLogin(),
    );

    return tDicoveryDocObservable.pipe(
      catchError((tErr) => {
        tResult.error =
          tErr && tErr.params && tErr.params.error_description
            ? tErr.params.error_description
            : '';
        tResult.erroredAt = 'tDicoveryDocObservable';
        return of(false);
      }),
      switchMap((tResp) => {
        const tHasValidToken = this._oauthService.hasValidAccessToken();
        if (!tResp || !tHasValidToken) {
          this.clearSavedUserSessionData();
          tResult.erroredAt =
            tResp && !tHasValidToken ? 'tokenValidation' : tResult.erroredAt;
          return of(tResult);
        }

        const tLoadUserProfileObservable = from(
          this._oauthService.loadUserProfile(),
        );
        return tLoadUserProfileObservable.pipe(
          catchError((tProfileErr) => {
            tResult.error =
              tProfileErr &&
              tProfileErr.params &&
              tProfileErr.params.error_description
                ? tProfileErr.params.error_description
                : '';
            tResult.erroredAt = 'loadUserProfile';
            return of(false);
          }),
          switchMap((tProfileResp) => {
            if (!tProfileResp) {
              this.clearSavedUserSessionData();
              return of(tResult);
            }

            const tToken = this._oauthService.getAccessToken();
            const tTokenObservable: Observable<AuthToken> = from(
              this._authService.createAuthToken(tToken),
            );

            return tTokenObservable.pipe(
              catchError((tGetTokenError) => {
                tResult.error =
                  tGetTokenError &&
                  tGetTokenError.error &&
                  tGetTokenError.error.error
                    ? tGetTokenError.error.error
                    : '';
                tResult.erroredAt = 'getToken';
                return of(false);
              }),
              switchMap((tGetTokenResp) => {
                if (!tGetTokenResp) {
                  this.clearSavedUserSessionData();
                  return of(tResult);
                }

                const tUserInfo: UserInfo = tProfileResp as UserInfo;
                tResult.user = tUserInfo;
                tResult.hasValidSession = true;
                this._oauthUser.next(tUserInfo);
                return of(tResult);
              }),
            );
          }),
        );
      }),
    );
  }

  clearSavedUserSessionData(): void {
    this._oauthUser.next({ sub: '' });
    sessionStorage.clear();
    localStorage.removeItem('Authorization');
  }

  setOautSessionError(pError: IOauthSessionCheckResult): void {
    this._erroredAt.next(pError);
  }
}
