import {Component, Input} from '@angular/core';
import {CustomPage} from '../../models/custom-page';
import {CustomPageService} from '../../service/custom-page.service';
import {PageService} from '../../service/page.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'admin-custom-page',
  templateUrl: './custom-page.component.html'
})
export class CustomPageComponent {
  @Input() customPage: CustomPage;

  constructor(private pageService: PageService, private customPageService: CustomPageService, private activeModal: NgbActiveModal) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  updatePage(): void {
    this.pageService.update(this.customPage.page.id, this.customPage.structure)
      .then(() => this.activeModal.close())
      .catch(error => this.handleError(error));
  }

  updateCustomPage() {
    this.customPageService.upsert(this.customPage.language.id, this.customPage.page.id, this.customPage.structure)
      .then(() => this.activeModal.close())
      .catch(error => this.handleError(error));
  }

  cancel(): void {
    this.activeModal.close();
  }
}
