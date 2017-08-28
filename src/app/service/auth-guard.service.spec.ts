import 'rxjs/add/operator/toPromise';
import {AuthGuardService} from './auth-guard.service';
import {DraftService} from './draft.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

class MockDraftService extends DraftService {
  canGetDrafts() {
    return Promise.reject('test');
  }
}

describe ('AuthGuardService', () => {
  it('opens login modal', (done) => {
    const mockDraftService = new MockDraftService(null, null);
    const mockNgbModal = new NgbModal(null, null, null);
    spyOn(mockNgbModal, 'open');

    const service = new AuthGuardService(mockDraftService, mockNgbModal);
    service.canActivate();

    setTimeout(() => {
      expect(mockNgbModal.open).toHaveBeenCalled();
      done();
    });
  });
});
