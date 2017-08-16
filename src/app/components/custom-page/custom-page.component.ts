import {Component, Input} from '@angular/core';
import {CustomPage} from '../../models/custom-page';
import {CustomPageService} from '../../service/custom-page.service';

@Component({
  selector: 'admin-custom-page',
  templateUrl: './custom-page.component.html'
})
export class CustomPageComponent {
  @Input() customPage: CustomPage;

  constructor(private customPageService: CustomPageService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  updateCustomPage() {
    this.customPageService.upsert(this.customPage.language.id, this.customPage.page.id, this.customPage.structure)
      .then()
      .catch(error => this.handleError(error));
  }
}
