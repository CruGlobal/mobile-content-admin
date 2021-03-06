import { Component } from '@angular/core';
import { Resource } from '../../models/resource';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DraftService } from '../../service/draft.service';
import { Translation } from '../../models/translation';

@Component({
  selector: 'admin-multiple-draft-generator',
  templateUrl: './multiple-draft-generator.component.html',
})
export class MultipleDraftGeneratorComponent {
  resource: Resource;
  translations: Translation[];

  confirmMessage: string;
  saving: boolean;
  errorMessage: string;

  readonly baseConfirmMessage =
    'Are you sure you want to generate a draft for these languages:';

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private draftService: DraftService,
  ) {}

  showConfirmAlert(): void {
    this.translations = this.resource.translations.filter(
      (translation) => translation.generateDraft,
    );
    if (this.translations.length === 0) {
      return;
    }

    const message = this.translations
      .map((translation) => translation.language.name)
      .join(', ');

    this.confirmMessage = `${this.baseConfirmMessage} ${message}?`;
  }

  generateDrafts(): void {
    this.saving = true;
    this.errorMessage = null;

    this.translations.forEach((translation, index) => {
      this.draftService
        .createDraft(translation)
        .then(() => {
          if (index === this.translations.length - 1) {
            this.ngbActiveModal.close();
          }
        })
        .catch((message) => {
          this.saving = false;
          this.errorMessage = message;
        });
    });
  }

  cancel(): void {
    this.ngbActiveModal.dismiss('dismissed draft generation modal');
  }
}
