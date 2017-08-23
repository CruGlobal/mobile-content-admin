import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

export abstract class AbstractEditResourceComponent {

  constructor(private activeModal: NgbActiveModal) {
  }

  closeEditModal() {
    this.activeModal.close();
  }

  abstract saveResource(): void;
}
