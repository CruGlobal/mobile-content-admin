import {Injectable} from '@angular/core';
import {Http, RequestOptionsArgs} from '@angular/http';
import {AuthToken} from '../models/auth-token';
import {WindowRefService} from '../models/window-ref-service';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {environment} from '../../environments/environment';
import {request_constants} from './request-constants';
import {AbstractService} from './abstract.service';

@Injectable()
export class AuthService extends AbstractService {
  private readonly authUrl = environment.base_url + 'auth';

  constructor(private http: Http, private windowRef: WindowRefService) {
    super();
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
