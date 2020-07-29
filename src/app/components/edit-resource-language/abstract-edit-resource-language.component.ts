import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Input, OnDestroy, ViewChild} from '@angular/core';
import {ResourceLanguage} from '../../models/resource-language';
import {SystemService} from '../../service/system.service';
import {AceEditorDirective} from 'ng2-ace-editor';

export abstract class AbstractEditResourceLanguageComponent implements OnDestroy {
  saving = false;
  errorMessage: string;

  @ViewChild(AceEditorDirective) editor;

  @Input() resourceLanguage: ResourceLanguage = new ResourceLanguage();

  protected constructor(protected systemService: SystemService,
                        protected activeModal: NgbActiveModal) {}

  ngOnDestroy(): void {
    // HACK: workaround this bug: https://github.com/ajaxorg/ace/issues/4042
    //       ng2-ace-editor bundles an older version of ace that doesn't have this fix
    this.editor.editor.renderer.freeze();
  }

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = message;
  }

  protected saveResourceLanguage(): void {
    this.activeModal.close('closed');
  }
}
