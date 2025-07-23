import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Tip } from '../../models/tip';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TipService } from '../../service/tip.service';
import { AceEditorDirective } from 'ng2-ace-editor';

@Component({
  selector: 'admin-create-tip',
  templateUrl: './create-tip.component.html',
})
export class CreateTipComponent implements OnDestroy {
  @Input() tip: Tip = new Tip();

  @ViewChild(AceEditorDirective, { static: false }) editor;

  saving = false;
  errorMessage: string;

  constructor(
    private tipService: TipService,
    private activeModal: NgbActiveModal,
  ) {}

  saveTip(): void {
    this.errorMessage = null;
    this.saving = true;

    this.tipService
      .create(this.tip)
      .then(() => this.activeModal.close())
      .catch((message) => (this.errorMessage = message))
      .then(() => (this.saving = false));
  }

  dismissModal(): void {
    this.activeModal.dismiss('dismissed create tip modal');
  }

  ngOnDestroy(): void {
    // HACK: workaround this bug: https://github.com/ajaxorg/ace/issues/4042
    //       ng2-ace-editor bundles an older version of ace that doesn't have this fix
    this.editor.editor.renderer.freeze();
  }
}
