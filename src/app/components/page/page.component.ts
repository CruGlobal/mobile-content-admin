import {Component, Input} from '@angular/core';
import {Page} from '../../models/page';
import {Translation} from '../../models/translation';
import {CustomPageService} from '../../service/custom-page.service';
import {PageService} from '../../service/page.service';

@Component({
  selector: 'admin-page',
  templateUrl: './page.component.html'
})
export class PageComponent {
  @Input() page: Page;
  @Input() translation: Translation;

  constructor(private pageService: PageService, private customPageService: CustomPageService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  updatePage(): void {
    this.pageService.update(this.page.id, this.page.structure)
      .then()
      .catch(error => this.handleError(error));
  }

  createCustomPage(): void {
    this.customPageService.upsert(this.translation.language.id, this.page.id, this.page.structure)
      .then()
      .catch(error => this.handleError(error));
  }
}
