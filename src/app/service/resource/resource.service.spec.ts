import 'rxjs/add/operator/toPromise';
import {ResourceService} from './resource.service';
import {Http, RequestOptionsArgs} from '@angular/http';
import {AuthService} from '../auth.service';
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

describe ('AuthGuardService', () => {
  const mockHttp = new MockHttp(null, null);
  const mockAuthService = new MockAuthService(null, null);
  const service = new ResourceService(mockHttp, mockAuthService);

  const resource = new Resource();

  beforeEach(() => {
    spyOn(mockHttp, 'post').and.returnValue(Observable.create(resource));
    spyOn(mockHttp, 'put').and.returnValue(Observable.create());
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
