import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Language} from '../../models/language';
import {Resource} from '../../models/resource';

@Component({
  selector: 'admin-xml-editor',
  templateUrl: './xml-editor.component.html'
})
export class XmlEditorComponent {
  @Input() type: string;
  @Input() filename: string;
  @Input() language: Language;
  @Input() resource: Resource;

  @Input() structure: string;
  @Output() structureChange = new EventEmitter();

  @Output() onCancel = new EventEmitter();
  @Output() onSaveForOne = new EventEmitter();
  @Output() onSaveForAll = new EventEmitter();

  private saving = false;
  private errorMessage: string;
  protected canConfirmSaveForAll = false;

  onStructureChange(code) {
    this.structureChange.emit(code);
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }

  protected saveForOne(): void {
    this.saving = true;
    this.onSaveForOne.emit();
  }

  protected saveForAll(): void {
    this.saving = true;
    this.onSaveForAll.emit();
  }

  protected cancel(): void {
    this.onCancel.emit();
  }
}
