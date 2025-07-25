import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AceEditorDirective } from 'ng2-ace-editor';
import { Tip } from '../../models/tip';
import { TipService } from '../../service/tip.service';

@Component({
  selector: 'admin-create-tip',
  templateUrl: './create-tip.component.html',
})
export class CreateTipComponent implements OnDestroy {
  @Input() tip: Tip = new Tip();

  @ViewChild(AceEditorDirective) editor;

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
    //       ng2-ace-editor uses brace@0.11.1 which bundles an older version of ace without the fix
    this.editor?.editor?.renderer?.freeze();
  }
}
