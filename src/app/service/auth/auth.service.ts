import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../../environments/environment';
import { AuthToken } from '../../models/auth-token';
import { WindowRefService } from '../../models/window-ref-service';
import { AbstractService } from '../abstract.service';

@Injectable()
export class AuthService extends AbstractService {
  private readonly authTokenKey = 'Authorization';
  private readonly authUrl = environment.base_url + 'auth';

  constructor(private http: HttpClient, private windowRef: WindowRefService) {
    super();
  }

  get authToken(): string | null {
    return this.windowRef.nativeWindow.localStorage.getItem(this.authTokenKey);
  }

  setAuthToken(token: string): void {
    this.windowRef.nativeWindow.localStorage.setItem(this.authTokenKey, token);
  }

  clearAuthToken(): void {
    this.windowRef.nativeWindow.localStorage.removeItem(this.authTokenKey);
  }

  getAuthorizationAndOptions() {
    const headers = this.requestOptions.headers.set(
      'Authorization',
      this.authToken || '',
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
        this.setAuthToken(token.token);
        return token;
      })
      .catch(this.handleError);
  }
}
