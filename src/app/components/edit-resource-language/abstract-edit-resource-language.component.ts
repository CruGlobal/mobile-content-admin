import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Input} from '@angular/core';
import {ResourceLanguage} from '../../models/resource-language';
import {SystemService} from '../../service/system.service';

export abstract class AbstractEditResourceLanguageComponent {
  saving = false;
  errorMessage: string;

  @Input() resourceLanguage: ResourceLanguage = new ResourceLanguage();

  protected constructor(protected systemService: SystemService,
                        protected activeModal: NgbActiveModal) {}

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = message;
  }

  protected saveResourceLanguage(): void {
    this.activeModal.close('closed');
  }
}
