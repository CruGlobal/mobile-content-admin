import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DraftService } from '../draft.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private draftService: DraftService,
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
        this.router.navigate(['/', 'login', 'callback']);
        return false;
      });
  }
}
