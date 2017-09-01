import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

export abstract class AbstractEditResourceComponent {
  protected saving = false;
  protected errorMessage: string;

  constructor(protected activeModal: NgbActiveModal) {}

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  protected handleError(message): void {
    this.errorMessage = message;
  }

  protected saveResource(): void {
    this.activeModal.close('closed');
  }
}
