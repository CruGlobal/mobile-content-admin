import {Component, Input, ViewChild} from '@angular/core';
import {CustomPage} from '../../models/custom-page';
import {CustomPageService} from '../../service/custom-page.service';
import {PageService} from '../../service/page.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {XmlEditorComponent} from '../xml-editor/xml-editor.component';

@Component({
  selector: 'admin-custom-page',
  templateUrl: './custom-page.component.html'
})
export class CustomPageComponent {
  @Input() customPage: CustomPage;
  @ViewChild(XmlEditorComponent) private xmlEditor: XmlEditorComponent;

  constructor(private pageService: PageService, private customPageService: CustomPageService, private activeModal: NgbActiveModal) {}

  updatePage(): void {
    this.pageService.update(this.customPage.page.id, this.customPage.structure)
      .then(() => this.activeModal.close())
      .catch(this.handleError.bind(this));
  }

  updateCustomPage(): void {
    this.customPageService.upsert(this.customPage.language.id, this.customPage.page.id, this.customPage.structure)
      .then(() => this.activeModal.close())
      .catch(this.handleError.bind(this));
  }

  cancel(): void {
    this.activeModal.close();
  }

  private handleError(message: string): void {
    this.xmlEditor.setErrorMessage(message);
  }
}
