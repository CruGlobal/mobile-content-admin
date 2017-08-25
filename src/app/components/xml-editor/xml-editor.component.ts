import {Component, Input} from '@angular/core';
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
}
