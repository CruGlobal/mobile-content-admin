import 'rxjs/add/operator/toPromise';
import {ResourceService} from '../resource/resource.service';
import {Http, RequestOptionsArgs} from '@angular/http';
import {AuthService} from '../auth/auth.service';
import {Resource} from '../../models/resource';
import {Observable} from 'rxjs/Observable';
import anything = jasmine.anything;

const headers: RequestOptionsArgs = {};

class MockHttp extends Http {
}

class MockAuthService extends AuthService {
  getAuthorizationAndOptions() {
    return headers;
  }
}

describe ('ResourceService', () => {
  const mockHttp = new MockHttp(null, null);
  const mockAuthService = new MockAuthService(null, null);
  const service = new ResourceService(mockHttp, mockAuthService);

  const resource = new Resource();

  beforeEach(() => {
    spyOn(mockHttp, 'post').and.returnValue(Observable.create(observer => {
      observer.next({
        json() { return new Resource(); }
      });
      observer.complete();
    }));

    spyOn(mockHttp, 'put').and.returnValue(Observable.create(observer => observer.complete()));
  });

  it('creating uses authorization code', () => {
    service.create(resource);

    expect(mockHttp.post).toHaveBeenCalledWith(anything(), anything(), headers);
  });

  it('updating uses authorization code', () => {
    service.update(resource);

    expect(mockHttp.put).toHaveBeenCalledWith(anything(), anything(), headers);
  });
});
