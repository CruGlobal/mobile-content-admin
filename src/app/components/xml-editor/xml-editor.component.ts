import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Language} from '../../models/language';
import {Resource} from '../../models/resource';

@Component({
  selector: 'admin-xml-editor',
  templateUrl: './xml-editor.component.html'
})
export class XmlEditorComponent {

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

  private saving = false;
  private errorMessage: string;

  onStructureChange(code) {
    this.structureChange.emit(code);
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }

  protected save(): void {
    this.saving = true;
    this.onSave.emit();
  }

  protected cancel(): void {
    this.onCancel.emit();
  }
}
