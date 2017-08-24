import {Injectable} from '@angular/core';
import {Http, RequestOptionsArgs} from '@angular/http';
import {AuthToken} from '../models/auth-token';
import {WindowRefService} from '../models/window-ref-service';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthService {
  private readonly authUrl = environment.base_url + 'auth';

  constructor(private http: Http, private windowRef: WindowRefService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  getAuthorizationAndOptions(): RequestOptionsArgs {
    const options: RequestOptionsArgs = environment.request_options;
    options.headers.append('Authorization', this.windowRef.nativeWindow.localStorage.getItem('Authorization'));
    return options;
  }

  createAuthToken(accessCode: number): Promise<AuthToken> {
    return this.http.post(this.authUrl, `{"data": {"attributes": {"code":${accessCode}}}}`, environment.request_options)
      .toPromise()
      .then(response => {
        const token: AuthToken = new JsonApiDataStore().sync(response.json());
        this.windowRef.nativeWindow.localStorage.setItem('Authorization', token.token);
        return token;
      })
      .catch(this.handleError);
  }
}
