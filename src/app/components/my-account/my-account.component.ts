import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';
import { UserAuthSessionService } from '../../service/auth/user-auth-session.service';

@Component({
  selector: 'admin-my-account',
  templateUrl: './my-account.component.html',
})
export class MyAccountComponent implements OnInit, OnDestroy {
  private _unsubscribeAll = new Subject<any>();
  userInfo$: Observable<UserInfo>;

  constructor(
    private userSessionService: UserAuthSessionService,
    private router: Router,
  ) {
    this.userInfo$ = this.userSessionService.oauthUser$;
  }

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onLogout(): void {
    this.router.navigate(['/', 'login', 'callback']);
    setTimeout(() => {
      this.userSessionService.clearSavedUserSessionData();
    }, 0);
  }
}
