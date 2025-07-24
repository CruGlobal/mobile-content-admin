import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthToken } from '../../models/auth-token';
import { WindowRefService } from '../../models/window-ref-service';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../../environments/environment';
import { AbstractService } from '../abstract.service';

@Injectable()
export class AuthService extends AbstractService {
  private readonly authUrl = environment.base_url + 'auth';

  constructor(private http: HttpClient, private windowRef: WindowRefService) {
    super();
  }

  getAuthorizationAndOptions() {
    const authToken = this.windowRef.nativeWindow.sessionStorage.getItem(
      'Authorization',
    );
    const headers = this.requestOptions.headers.set(
      'Authorization',
      authToken || '',
    );
    return { headers };
  }

  createAuthToken(accessCode: string): Promise<AuthToken> {
    return this.http
      .post(
        this.authUrl,
        `{"data": {"attributes": {"okta_access_token":"${accessCode}"}}}`,
        this.requestOptions,
      )
      .toPromise()
      .then((response) => {
        const token: AuthToken = new JsonApiDataStore().sync(response);
        this.windowRef.nativeWindow.sessionStorage.setItem(
          'Authorization',
          token.token,
        );
        return token;
      })
      .catch(this.handleError);
  }
}
