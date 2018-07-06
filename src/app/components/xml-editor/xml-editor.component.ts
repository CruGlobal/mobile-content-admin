import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Language} from '../../models/language';
import {Resource} from '../../models/resource';

@Component({
  selector: 'admin-xml-editor',
  templateUrl: './xml-editor.component.html'
})
export class XmlEditorComponent {

  readonly saveForOneMessage = 'Save (this language only)';
  readonly saveForAllMessage = 'Save for all languages';
  readonly baseLanguageCode = 'en'; // TODO would be nice to store a field called base_language instead of hardcoding

  @Input() type: string;
  @Input() filename: string;
  @Input() language?: Language;
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

  getConfirmationMessage(): string {
    return `Are you sure you want to save this as the structure for ${this.filename} for all languages?`;
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
