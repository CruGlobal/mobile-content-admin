import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OklaLoginErrorComponent } from '../../components/okla-login-error/okla-login-error.component';
import { DraftService } from '../draft.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private draftService: DraftService,
    private modalService: NgbModal,
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
        const errorMessage = 'Login required.';
        const modalRef: NgbModalRef = this.modalService.open(
          OklaLoginErrorComponent,
          { size: 'lg' },
        );
        modalRef.componentInstance.errorMessage = errorMessage;
        this.router.navigate(['/', 'login', 'callback']);
        return false;
      });
  }
}
