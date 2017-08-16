import {Component, Input} from '@angular/core';
import {Page} from '../../models/page';
import {Translation} from '../../models/translation';
import {CustomPageService} from '../../service/custom-page.service';

@Component({
  selector: 'admin-page',
  templateUrl: './page.component.html'
})
export class PageComponent {
  @Input() page: Page;
  @Input() translation: Translation;

  constructor(private customPageService: CustomPageService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  createCustomPage(): void {
    this.customPageService.upsert(this.translation.language.id, this.page.id, this.page.structure)
      .then()
      .catch(error => this.handleError(error));
  }
}
