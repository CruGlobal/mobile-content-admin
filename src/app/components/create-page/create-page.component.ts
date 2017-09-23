import {Component, Input} from '@angular/core';
import {Page} from '../../models/page';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PageService} from '../../service/page.service';

@Component({
  selector: 'admin-create-page',
  templateUrl: './create-page.component.html',
})
export class CreatePageComponent {
  @Input() page: Page = new Page();

  errorMessage: string;
  saving = false;

  constructor(private pageService: PageService, private activeModal: NgbActiveModal) {}

  savePage(): void {
    this.errorMessage = null;
    this.saving = true;

    this.pageService.create(this.page)
      .then(() => this.activeModal.close())
      .catch(message => this.errorMessage = message)
      .then(() => this.saving = false);
  }

  dismissModal(): void {
    this.activeModal.dismiss('dismissed create page modal');
  }
}
