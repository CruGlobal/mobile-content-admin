import 'rxjs/add/operator/toPromise';
import { UserAuthSessionService } from '../auth/user-auth-session.service';
import { DraftService } from '../draft.service';
import { AuthGuardService } from './auth-guard.service';

class MockDraftService extends DraftService {
  canGetDrafts() {
    return Promise.reject('test');
  }
}

describe('AuthGuardService', () => {
  it('opens login modal', (done) => {
    const mockDraftService = new MockDraftService(null, null);
    const mockUserAuthService = new UserAuthSessionService(null, null);
    spyOn(mockUserAuthService, 'clearSavedUserSessionData');

    const service = new AuthGuardService(
      mockDraftService,
      mockUserAuthService,
      null,
    );
    service.canActivate();

    setTimeout(() => {
      expect(mockUserAuthService.clearSavedUserSessionData).toHaveBeenCalled();
      done();
    });
  });
});
