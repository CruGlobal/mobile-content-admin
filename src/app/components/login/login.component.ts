import {Component, Input} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'admin-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @Input() accessCode: string;

  private errorMessage: string;
  private saving = false;

  constructor(private authService: AuthService, private activeModal: NgbActiveModal) {}

  createAuthToken(): void {
    this.saving = true;

    this.authService.createAuthToken(this.accessCode)
      .then(() => this.activeModal.close())
      .catch(errors => {
        this.errorMessage = errors[0].detail;
        this.saving = false;
      });
  }
}