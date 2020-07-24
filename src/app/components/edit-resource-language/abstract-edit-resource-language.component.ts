import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Input, OnDestroy} from '@angular/core';
import {ResourceLanguage} from '../../models/resource-language';
import {System} from '../../models/system';
import {SystemService} from '../../service/system.service';
import {ResourceTypeService} from '../../service/resource-type.service';
import {AceEditorDirective} from 'ng2-ace-editor';

export abstract class AbstractEditResourceLanguageComponent implements OnDestroy {
  saving = false;
  errorMessage: string;

  @ViewChild(AceEditorDirective) editor;

  @Input() resourceLanguage: ResourceLanguage = new ResourceLanguage();
  systems: System[];

  protected constructor(protected systemService: SystemService,
                        protected activeModal: NgbActiveModal) {}

  init(systemsCallback): void {
    this.systemService.getSystems().then(systems => {
      this.systems = systems;

      if (systemsCallback) {
        systemsCallback.call();
      }
    });
  }

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
