import {Component, Input, ViewChild} from '@angular/core';
import {Page} from '../../models/page';
import {Translation} from '../../models/translation';
import {CustomPageService} from '../../service/custom-page.service';
import {PageService} from '../../service/page.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {XmlEditorComponent} from '../xml-editor/xml-editor.component';

@Component({
  selector: 'admin-page',
  templateUrl: './page.component.html'
})
export class PageComponent {
  @Input() page: Page;
  @Input() translation: Translation;
  @ViewChild(XmlEditorComponent) private xmlEditor: XmlEditorComponent;

  constructor(private pageService: PageService, private customPageService: CustomPageService, private activeModal: NgbActiveModal) {}

  updatePage(): void {
    this.pageService.update(this.page.id, this.page.structure)
      .then(() => this.activeModal.close())
      .catch(errors => this.xmlEditor.setErrorMessage(errors[0].detail));
  }

  createCustomPage(): void {
    this.customPageService.upsert(this.translation.language.id, this.page.id, this.page.structure)
      .then(() => this.activeModal.close())
      .catch(errors => this.xmlEditor.setErrorMessage(errors[0].detail));
  }

  cancel(): void {
    this.activeModal.close();
  }
}
