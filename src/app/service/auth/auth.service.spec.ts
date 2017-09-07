import 'rxjs/add/operator/toPromise';
import {Http} from '@angular/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import {WindowRefService} from '../../models/window-ref-service';

const token = 'bc2bd721-4fa5-4e21-a0c3-94962da8919c';

const response = {
  json() {
    return {
      data: {
        attributes: {
          token: token
        }
      }
    };
  }
};

class MockHttp extends Http {
  post() {
    return Observable.create(observer => {
      observer.next(response);
      observer.complete();
    });
  }
}

describe ('AuthService', () => {
  const mockHttp = new MockHttp(null, null);
  const windowRef = new WindowRefService();

  const service = new AuthService(mockHttp, windowRef);

  it('saves auth code after successful authentication', () => {
    service.createAuthToken('code');

    expect(windowRef.nativeWindow.localStorage.getItem('Authorization')).toBe(token);
  });
});
