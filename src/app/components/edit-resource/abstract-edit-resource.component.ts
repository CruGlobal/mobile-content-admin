import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

export abstract class AbstractEditResourceComponent {

  constructor(protected activeModal: NgbActiveModal) {
  }

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  protected saveResource(): void {
    this.activeModal.close('closed');
  }
}
