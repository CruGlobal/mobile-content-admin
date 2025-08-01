import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomTip } from '../../models/custom-tip';
import { Translation } from '../../models/translation';
import { CustomTipService } from '../../service/custom-tip.service';
import { DraftService } from '../../service/draft.service';
import { XmlEditorComponent } from '../xml-editor/xml-editor.component';

@Component({
  selector: 'admin-custom-tip',
  templateUrl: './custom-tip.component.html',
})
export class CustomTipComponent implements OnInit {
  @Input() customTip: CustomTip;
  @Input() translation: Translation;
  @ViewChild(XmlEditorComponent) private xmlEditor: XmlEditorComponent;

  loading = true;
  loadingError: string;

  constructor(
    private customTipService: CustomTipService,
    private draftService: DraftService,
    private activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.draftService
      .getTip(this.customTip.tip, this.translation)
      .then((response) => {
        this.customTip.structure = response;
      })
      .catch((message) => (this.loadingError = message))
      .then(() => (this.loading = false));
  }

  updateCustomTip(): void {
    this.customTipService
      .upsert(
        this.customTip.language.id,
        this.customTip.tip.id,
        this.customTip.structure,
      )
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
