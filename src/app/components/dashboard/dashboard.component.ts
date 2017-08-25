import {Component, Input} from '@angular/core';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  @Input() accessCode: string;

  constructor(private authService: AuthService) {}

  createAuthToken(): void {
    this.authService.createAuthToken(this.accessCode).then();
  }
}
