import {Component, Input} from '@angular/core';
import {Translation} from '../../models/translation';
import {DraftService} from '../../service/translation.service';

@Component({
  selector: 'translation',
  templateUrl: './translation.component.html',
})
export class TranslationComponent {
  @Input() translation: Translation;

  constructor(private draftService: DraftService) {}

  createDraft(): void {
    const resourceId = this.translation.relationships.resource.data.id;
    const languageId = this.translation.relationships.language.data.id;
    this.draftService.createDraft(resourceId, languageId).then((d) => {

    });
  }
}
