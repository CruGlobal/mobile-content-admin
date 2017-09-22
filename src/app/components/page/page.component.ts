import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../models/page';
import {Translation} from '../../models/translation';
import {CustomPageService} from '../../service/custom-page.service';
import {PageService} from '../../service/page.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {XmlEditorComponent} from '../xml-editor/xml-editor.component';
import {DraftService} from '../../service/draft.service';

@Component({
  selector: 'admin-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {
  @Input() page: Page;
  @Input() translation: Translation;
  @ViewChild(XmlEditorComponent) private xmlEditor: XmlEditorComponent;

  loading = true;

  constructor(private pageService: PageService,
              private customPageService: CustomPageService,
              private draftService: DraftService,
              private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.draftService.getPage(this.page, this.translation)
      .then((response) => {
        this.page.structure = response;
      })
      .catch(this.handleError.bind(this))
      .then(() => this.loading = false);
  }

  updatePage(): void {
    this.pageService.update(this.page.id, this.page.structure)
      .then(() => this.activeModal.close())
      .catch(this.handleError.bind(this));
  }

  createCustomPage(): void {
    this.customPageService.upsert(this.translation.language.id, this.page.id, this.page.structure)
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
