import {Component, Input, OnInit} from '@angular/core';
import {Page} from '../../models/page';
import {DraftService} from '../../service/draft.service';
import {Translation} from '../../models/translation';

@Component({
  selector: 'admin-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {
  @Input() page: Page;
  @Input() translation: Translation;

  constructor(private draftService: DraftService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  ngOnInit(): void {
    this.draftService.getPage(this.page, this.translation).then(response => {
      this.page.structure = response;
    }).catch(error => this.handleError(error));
  }
}
