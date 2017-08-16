import {Component, Input} from '@angular/core';
import {Translation} from '../../models/translation';
import {CustomPage} from '../../models/custom-page';
import {CustomPageService} from '../../service/custom-page.service';

@Component({
  selector: 'admin-custom-page',
  templateUrl: './custom-page.component.html'
})
export class CustomPageComponent {
  @Input() customPage: CustomPage;
  @Input() translation: Translation;

  constructor(private customPageService: CustomPageService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.message || error);
  }

  updateCustomPage() {
    this.customPageService.update(this.customPage).then();
  }
}
