import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

export abstract class AbstractEditResourceComponent {
  protected saving = false;
  protected errorMessage: string;

  constructor(protected activeModal: NgbActiveModal) {}

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  protected handleError(errors): void {
    this.errorMessage = errors[0].detail;
  }

  protected saveResource(): void {
    this.activeModal.close('closed');
  }
}
