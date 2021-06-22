import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { OklaLoginErrorComponent } from './components/okla-login-error/okla-login-error.component';
import { UserAuthSessionService } from './service/auth/user-auth-session.service';

@Component({
  selector: 'admin-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private _unsubscribeAll = new Subject<any>();
  private _appSessionReady = new Subject<any>();

  appReady: boolean;
  sessionReady$: Observable<boolean> = this._appSessionReady.asObservable();
  title = 'Mobile Content Admin';

  constructor(
    private userSessionService: UserAuthSessionService,
    private router: Router,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.awaitOauthSessionError();

    this.router.events
      .pipe(takeUntil(this._appSessionReady))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          if (!this.router.navigated) {
            if (event.url.startsWith(environment.oidc_auth.login_result_url)) {
              this.awaitSavedSessionCheckResult(true);
            } else {
              this.userSessionService.clearSavedUserSessionData();
              setTimeout(() => {
                this.appReady = true;
                this._appSessionReady.next();
              }, 200);
            }
          }
        }
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private awaitSavedSessionCheckResult(isLoginScreen?: boolean): void {
    this.userSessionService
      .checkOauthSession()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((tResp) => {
        if (tResp && tResp.hasValidSession) {
          if (isLoginScreen) {
            this.router.navigate(['/']);
            setTimeout(() => {
              this.appReady = true;
            }, 0);
          } else {
            setTimeout(() => {
              this.appReady = true;
            }, 0);
          }
        } else if (tResp.erroredAt && isLoginScreen) {
          this.userSessionService.setOautSessionError(tResp);
        } else {
          this.userSessionService.clearSavedUserSessionData();
          this.router.navigate(['/', 'login', 'callback']);
          setTimeout(() => {
            this.appReady = true;
          }, 10);
        }
      });
  }

  private awaitOauthSessionError(): void {
    this.userSessionService.oauthSessionError$
      .pipe(takeUntil(this._unsubscribeAll), distinctUntilChanged())
      .subscribe((tResp) => {
        if (tResp && tResp.erroredAt) {
          const errorStep = tResp.erroredAt;
          let errorMessage = '';
          switch (errorStep) {
            case 'tDicoveryDocObservable':
              errorMessage =
                'Failed to connect to the Okla instance.' +
                (tResp.error ? `<br/>${tResp.error}` : '');
              break;
            case 'tokenValidation':
              break;
            case 'loadUserProfile':
              errorMessage =
                'Failed to load logged in user\'s profile.' +
                (tResp.error ? `<br/>${tResp.error}` : '');
              break;
            case 'getToken':
              errorMessage =
                'Failed to get access code.' +
                (tResp.error ? `<br/>${tResp.error}` : '');
              break;
            default:
              break;
          }
          if (errorMessage) {
            const modalRef: NgbModalRef = this.modalService.open(
              OklaLoginErrorComponent,
              { size: 'lg' },
            );
            modalRef.componentInstance.errorMessage = errorMessage;
          }
          setTimeout(() => {
            this.appReady = true;
          }, 10);
        }
      });
  }
}
