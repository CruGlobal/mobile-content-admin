import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DraftService } from '../draft.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../components/login/login.component';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private draftService: DraftService,
    private modalService: NgbModal,
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
        this.modalService.open(LoginComponent);
        return false;
      });
  }
}
