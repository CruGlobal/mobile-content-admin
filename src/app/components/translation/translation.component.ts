import {Component, Input} from '@angular/core';
import {Translation} from '../../models/translation';
import {DraftService} from '../../service/draft.service';
import {CustomPage} from '../../models/custom-page';
import {AbstractPage} from '../../models/abstract-page';

@Component({
  selector: 'admin-translation',
  templateUrl: './translation.component.html',
})
export class TranslationComponent {
  @Input() translation: Translation;

  constructor(private draftService: DraftService) {}

  getPages(): AbstractPage[] {
    return this.translation.resource.pages.map(page => {
      const customPage: CustomPage = this.translation.language['custom-pages'].find(c => c.page.id === page.id);

      if (!customPage) {
        return page;
      } else {
        customPage.page = page;
        return customPage;
      }
    });
  }

  createDraft(): void {
    const resourceId = this.translation.resource.id;
    const languageId = this.translation.language.id;
    this.draftService.createDraft(resourceId, languageId).then();
  }
}
