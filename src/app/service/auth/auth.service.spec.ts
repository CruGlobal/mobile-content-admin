import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { WindowRefService } from '../../models/window-ref-service';
import { UUID } from 'angular2-uuid';

let token: string;

const response = {
  data: {
    attributes: {
      token: token,
    },
  },
};

class MockHttpClient {
  post() {
    return Observable.create((observer) => {
      observer.next(response);
      observer.complete();
    });
  }
}

describe('AuthService', () => {
  const mockHttp = new MockHttpClient();
  const windowRef = new WindowRefService();

  const service = new AuthService(mockHttp as any, windowRef);

  beforeEach(() => {
    token = UUID.UUID();
  });

  it('sets auth header', (done) => {
    windowRef.nativeWindow.sessionStorage.setItem('Authorization', token);

    const result = service.getAuthorizationAndOptions();

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
