import { Component, OnDestroy, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

@Component({
  selector: 'admin-okta-login',
  templateUrl: './okta-login.component.html',
})
export class OktaLoginComponent implements OnInit, OnDestroy {
  private _unsubscribeAll = new Subject<any>();

  inprogress: boolean;

  constructor(private _oauthService: OAuthService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onLogin(): void {
    this.inprogress = true;
    setTimeout(() => {
      this._oauthService.initCodeFlow();
    }, 0);
  }
}
