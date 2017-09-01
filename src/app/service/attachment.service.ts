import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';
import {AbstractService} from './abstract.service';

@Injectable()
export class AttachmentService extends AbstractService {
  private readonly attachmentsUrl = environment.base_url + 'attachments';

  constructor(private http: Http, private authService: AuthService) {
    super();
  }

  deleteAttachment(id: number): Promise<void> {
    return this.http.delete(`${this.attachmentsUrl}/${id}`, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .catch(this.handleError);
  }
}
