import {Component, Input} from '@angular/core';
import {Page} from '../../models/page';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'admin-create-page',
  templateUrl: './create-page.component.html',
})
export class CreatePageComponent {
  @Input() page: Page = new Page();

  constructor(private activeModal: NgbActiveModal) {}

  savePage(): void {
    this.activeModal.close();
  }

  dismissModal(): void {
    this.activeModal.dismiss();
  }
}
