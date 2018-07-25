import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomPage} from '../../models/custom-page';
import {CustomPageService} from '../../service/custom-page.service';
import {PageService} from '../../service/page.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {XmlEditorComponent} from '../xml-editor/xml-editor.component';
import {DraftService} from '../../service/draft.service';
import {Translation} from '../../models/translation';

@Component({
  selector: 'admin-custom-page',
  templateUrl: './custom-page.component.html'
})
export class CustomPageComponent implements OnInit {
  @Input() customPage: CustomPage;
  @Input() translation: Translation;
  @ViewChild(XmlEditorComponent) private xmlEditor: XmlEditorComponent;

  loading = true;
  loadingError: string;

  constructor(private pageService: PageService,
              private customPageService: CustomPageService,
              private draftService: DraftService,
              private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.draftService.getPage(this.customPage.page, this.translation)
      .then((response) => {
        this.customPage.structure = response;
      })
      .catch((message) => this.loadingError = message)
      .then(() => this.loading = false);
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
