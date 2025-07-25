import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { AceEditorDirective } from 'ng2-ace-editor';
import { Language } from '../../models/language';
import { Resource } from '../../models/resource';

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

  @ViewChild(AceEditorDirective) editor;

  saving = false;
  errorMessage: string;

  onStructureChange(code) {
    this.structureChange.emit(code);
  }

  ngOnDestroy(): void {
    // HACK: workaround this bug: https://github.com/ajaxorg/ace/issues/4042
    //       ng2-ace-editor uses brace@0.11.1 which bundles an older version of ace without the fix
    this.editor?.editor?.renderer?.freeze();
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
