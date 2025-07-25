import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AbstractService } from './abstract.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AttachmentService extends AbstractService {
  private readonly attachmentsUrl = environment.base_url + 'attachments';

  constructor(private http: HttpClient, private authService: AuthService) {
    super();
  }

  deleteAttachment(id: number): Promise<void> {
    return this.http
      .delete(
        `${this.attachmentsUrl}/${id}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .catch(this.handleError);
  }
}
