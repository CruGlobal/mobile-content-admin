import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {DraftService} from './draft.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private draftService: DraftService) {}

  canActivate() {
    return this.draftService.canGetDrafts()
      .then(() => {
        console.log('User is authenticated.');
        return true;
      })
      .catch(() => {
        console.log('User is not authenticated.');
        return false;
      });
  }
}
