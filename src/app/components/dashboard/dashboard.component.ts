import {Component, Input} from '@angular/core';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  @Input() accessCode: string;

  private errorMessage: string;
  private saving = false;

  constructor(private authService: AuthService) {}

  createAuthToken(): void {
    this.saving = true;

    this.authService.createAuthToken(this.accessCode)
      .catch(errors => this.errorMessage = errors[0].detail)
      .then(() => this.saving = false);
  }
}
