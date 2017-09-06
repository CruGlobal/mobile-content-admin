import 'rxjs/add/operator/toPromise';
import {ResourceService} from './resource.service';
import {Http} from '@angular/http';
import {AuthService} from '../auth.service';

class MockHttp extends Http {
}

class MockAuthService extends AuthService {
}

describe ('AuthGuardService', () => {
  const mockHttp = new MockHttp(null, null);
  const mockAuthService = new MockAuthService(null, null);

  const service = new ResourceService(mockHttp, mockAuthService);

  it('creating uses authorization code', () => {
  });

  it('updating uses authorization code', () => {
  });
});
