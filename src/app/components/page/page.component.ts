import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../models/page';
import {PageService} from '../../service/page.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {XmlEditorComponent} from '../xml-editor/xml-editor.component';

@Component({
  selector: 'admin-page',
  templateUrl: './page.component.html'
})
export class PageComponent {
  @Input() page: Page;
  @ViewChild(XmlEditorComponent) private xmlEditor: XmlEditorComponent;

  constructor(private pageService: PageService,
              private activeModal: NgbActiveModal) {}

  updatePage(): void {
    this.pageService.update(this.page.id, this.page.structure)
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
