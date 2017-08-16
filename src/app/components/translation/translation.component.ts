import {Component, Input} from '@angular/core';
import {Translation} from '../../models/translation';
import {DraftService} from '../../service/draft.service';
import {Page} from '../../models/page';
import {CustomPage} from '../../models/custom-page';

@Component({
  selector: 'admin-translation',
  templateUrl: './translation.component.html',
})
export class TranslationComponent {
  @Input() translation: Translation;

  constructor(private draftService: DraftService) {}

  getPages(): Page[] {
    const pages = [];

    for (const page of this.translation.resource.pages) {
      const customPage: CustomPage = this.translation.language['custom-pages'].find(c => c.page.id === page.id);
      if (customPage != null) {
        pages.push(customPage);
      } else {
        pages.push(page);
      }
    }

    return pages;
  }

  createDraft(): void {
    const resourceId = this.translation.resource.id;
    const languageId = this.translation.language.id;
    this.draftService.createDraft(resourceId, languageId).then((d) => {

    });
  }
}
