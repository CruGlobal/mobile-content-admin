import { Component, Input, ViewChild } from '@angular/core';
import { Tip } from '../../models/tip';
import { TipService } from '../../service/tip.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { XmlEditorComponent } from '../xml-editor/xml-editor.component';

@Component({
  selector: 'admin-tip',
  templateUrl: './tip.component.html',
})
export class TipComponent {
  @Input() tip: Tip;
  @ViewChild(XmlEditorComponent) private xmlEditor: XmlEditorComponent;

  constructor(
    private tipService: TipService,
    private activeModal: NgbActiveModal,
  ) {}

  updateTip(): void {
    this.tipService
      .update(this.tip.id, this.tip.structure)
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
