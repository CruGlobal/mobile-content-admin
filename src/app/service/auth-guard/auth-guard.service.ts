import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserAuthSessionService } from '../auth/user-auth-session.service';
import { DraftService } from '../draft.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private draftService: DraftService,
    private userSessionService: UserAuthSessionService,
    private router: Router,
  ) {}

  canActivate() {
    return this.draftService
      .canGetDrafts()
      .then(() => {
        console.log('User is authenticated.');
        return true;
      })
      .catch(() => {
        console.log('User is not authenticated.');
        this.userSessionService.clearSavedUserSessionData();
        if (this.router) {
          setTimeout(() => {
            this.router.navigate(['/', 'login', 'callback']);
          }, 0);
        }
        return false;
      });
  }
}
