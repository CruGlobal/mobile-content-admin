import {Component, Input} from '@angular/core';
import {Page} from '../../models/page';
import {DraftService} from '../../service/draft.service';
import {Translation} from '../../models/translation';

@Component({
  selector: 'admin-page',
  templateUrl: './page.component.html'
})
export class PageComponent {
  @Input() page: Page;
  @Input() translation: Translation;

  constructor(private draftService: DraftService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

}
