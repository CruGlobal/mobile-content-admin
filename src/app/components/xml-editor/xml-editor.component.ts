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

  @Input() onCancel;
  @Input() onSaveForOne;
  @Input() onSaveForAll;

  private saving = false;
  private errorMessage: string;

  onStructureChange(code) {
    this.structureChange.emit(code);
  }

  private saveForOne(): void {
    this.saving = true;
    this.onSaveForOne();
  }

  private saveForAll(): void {
    this.saving = true;
    this.onSaveForAll();
  }
}
