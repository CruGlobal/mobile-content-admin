import 'rxjs/add/operator/toPromise';
import { Http, RequestOptionsArgs } from '@angular/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { WindowRefService } from '../../models/window-ref-service';
import { UUID } from 'angular2-uuid';

let token: string;

const response = {
  json() {
    return {
      data: {
        attributes: {
          token: token,
        },
      },
    };
  },
};

class MockHttp extends Http {
  post() {
    return Observable.create((observer) => {
      observer.next(response);
      observer.complete();
    });
  }
}

describe('AuthService', () => {
  const mockHttp = new MockHttp(null, null);
  const windowRef = new WindowRefService();

  const service = new AuthService(mockHttp, windowRef);

  beforeEach(() => {
    token = UUID.UUID();
  });

  it('sets auth header', (done) => {
    windowRef.nativeWindow.sessionStorage.setItem('Authorization', token);

    const result: RequestOptionsArgs = service.getAuthorizationAndOptions();

    setTimeout(() => {
      expect(result.headers.get('Authorization')).toBe(token);
      done();
    });
  });

  it('saves auth code after successful authentication', (done) => {
    service.createAuthToken('code');

    setTimeout(() => {
      expect(
        windowRef.nativeWindow.sessionStorage.getItem('Authorization'),
      ).toBe(token);
      done();
    });
  });
});
