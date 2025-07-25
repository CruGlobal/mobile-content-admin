import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'admin-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @Input() accessCode: string;

  saving = false;
  errorMessage: string;

  constructor(
    private authService: AuthService,
    private activeModal: NgbActiveModal,
  ) {}

  createAuthToken(): void {
    this.saving = true;

    this.authService
      .createAuthToken(this.accessCode)
      .then(() => this.activeModal.close())
      .catch((message) => (this.errorMessage = message))
      .then(() => (this.saving = false));
  }
}
