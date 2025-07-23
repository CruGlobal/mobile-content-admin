import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Language } from '../../models/language';
import { Resource } from '../../models/resource';
import { AceEditorDirective } from 'ng2-ace-editor';

@Component({
  selector: 'admin-xml-editor',
  templateUrl: './xml-editor.component.html',
})
export class XmlEditorComponent implements OnDestroy {
  readonly saveMessage = 'Save';
  readonly cancelMessage = 'Cancel';

  @Input() type: string;
  @Input() filename: string;
  @Input() language?: Language;
  @Input() resource: Resource;

  @Input() structure: string;
  @Output() structureChange = new EventEmitter();

  @Output() onCancel = new EventEmitter();
  @Output() onSave = new EventEmitter();

  @ViewChild(AceEditorDirective, { static: false }) editor;

  saving = false;
  errorMessage: string;

  onStructureChange(code) {
    this.structureChange.emit(code);
  }

  ngOnDestroy(): void {
    // HACK: workaround this bug: https://github.com/ajaxorg/ace/issues/4042
    //       ng2-ace-editor bundles an older version of ace that doesn't have this fix
    this.editor.editor.renderer.freeze();
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }

  save(): void {
    this.saving = true;
    this.onSave.emit();
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
