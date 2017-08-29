import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable()
export class AttachmentService {
  private readonly attachmentsUrl = environment.base_url + 'attachments';

  constructor(private http: Http, private authService: AuthService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.json().errors);
  }

  deleteAttachment(id: number): Promise<void> {
    return this.http.delete(`${this.attachmentsUrl}/${id}`, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .catch(this.handleError);
  }
}
