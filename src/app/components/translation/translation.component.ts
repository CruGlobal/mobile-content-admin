import {Component, Input} from '@angular/core';
import {Translation} from '../../models/translation';
import {DraftService} from '../../service/draft.service';
import {PageService} from '../../service/page.service';
import {Page} from '../../models/page';
import {CustomPage} from '../../models/custom-page';

@Component({
  selector: 'admin-translation',
  templateUrl: './translation.component.html',
})
export class TranslationComponent {
  @Input() translation: Translation;

  constructor(private draftService: DraftService, private pageService: PageService) {}

  getPages(): Page[] {
    const pages = [];

    for (const page of this.translation.resource.pages) {
      const customPage: CustomPage = this.translation.language['custom-pages'].find(c => c.page.id == page.id);
      if (customPage != null) {
        customPage.type = 'custom-page';
        pages.push(customPage);
      } else {
        page.type = 'page';
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

  updateXml(page: Page): void {
    this.pageService.update(page).then(response => {

    });
  }
}
