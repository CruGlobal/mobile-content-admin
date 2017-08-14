import {Injectable} from '@angular/core';
import {Http, RequestOptionsArgs, Headers} from '@angular/http';
import {AuthToken} from '../models/auth-token';
import {Constants} from '../constants';
import {WindowRefService} from '../models/window-ref-service';

@Injectable()
export class AuthService {
  private readonly authUrl = Constants.BASE_URL + 'auth';

  constructor(private http: Http, private windowRef: WindowRefService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  getHttpOptions(): RequestOptionsArgs {
    return {
      headers: new Headers(
        {
          'Content-Type': 'application/vnd.api+json',
          'Authorization': this.windowRef.nativeWindow.localStorage.getItem('Authorization')
        })
    };
  }

  createAuthToken(accessCode: number): Promise<AuthToken> {
    return this.http.post(this.authUrl, `{"data": {"attributes": {"code":${accessCode}}}}`, Constants.OPTIONS)
      .toPromise()
      .then(response => {
        const token: AuthToken = response.json().data as AuthToken;
        this.windowRef.nativeWindow.localStorage.setItem('Authorization', token.attributes.token);
        return token;
      })
      .catch(this.handleError);
  }
}
