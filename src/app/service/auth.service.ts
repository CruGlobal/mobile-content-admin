import {Injectable} from '@angular/core';
import {Http, RequestOptionsArgs} from '@angular/http';
import {AuthToken} from '../models/auth-token';
import {WindowRefService} from '../models/window-ref-service';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {environment} from '../../environments/environment';
import {request_constants} from './request-constants';

@Injectable()
export class AuthService {
  private readonly authUrl = environment.base_url + 'auth';

  constructor(private http: Http, private windowRef: WindowRefService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.json().errors);
  }

  getAuthorizationAndOptions(): RequestOptionsArgs {
    const options: RequestOptionsArgs = request_constants.options;
    options.headers.set('Authorization', this.windowRef.nativeWindow.localStorage.getItem('Authorization'));
    return options;
  }

  createAuthToken(accessCode: string): Promise<AuthToken> {
    return this.http.post(this.authUrl, `{"data": {"attributes": {"code":"${accessCode}"}}}`, request_constants.options)
      .toPromise()
      .then(response => {
        const token: AuthToken = new JsonApiDataStore().sync(response.json());
        this.windowRef.nativeWindow.localStorage.setItem('Authorization', token.token);
        return token;
      })
      .catch(this.handleError);
  }
}
