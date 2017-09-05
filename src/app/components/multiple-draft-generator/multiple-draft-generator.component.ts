import {Component} from '@angular/core';
import {Resource} from '../../models/resource';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DraftService} from '../../service/draft.service';
import {Translation} from '../../models/translation';

@Component({
  selector: 'admin-multiple-draft-generator',
  templateUrl: './multiple-draft-generator.component.html'
})
export class MultipleDraftGeneratorComponent {
  resource: Resource;

  constructor(private ngbActiveModal: NgbActiveModal, private draftService: DraftService) {}

  generateDrafts(): void {
    const translations: Translation[] = this.resource.translations.filter(translation => translation.generateDraft);

    translations.forEach((translation, index) => {
      this.draftService.createDraft(translation)
        .then(() => {
          if (index === translations.length - 1) {
            this.ngbActiveModal.close();
          }
        });
    });
  }

  cancel(): void {
    this.ngbActiveModal.dismiss();
  }
}
