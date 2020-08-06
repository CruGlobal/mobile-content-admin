import { Component, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { XmlEditorComponent } from '../xml-editor/xml-editor.component';
import { CustomManifest } from '../../models/custom-manifest';
import { CustomManifestService } from '../../service/custom-manifest.service';

@Component({
  selector: 'admin-custom-page',
  templateUrl: './custom-manifest.component.html',
})
export class CustomManifestComponent {
  @Input() customManifest: CustomManifest;
  @ViewChild(XmlEditorComponent) private xmlEditor: XmlEditorComponent;

  loading = false;

  constructor(
    private customManifestService: CustomManifestService,
    private activeModal: NgbActiveModal,
  ) {}

  updateCustomManifest(): void {
    this.customManifestService
      .upsert(this.customManifest)
      .then((customManifest) => this.activeModal.close(customManifest))
      .catch(this.handleError.bind(this));
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  private handleError(message: string): void {
    this.xmlEditor.setErrorMessage(message);
  }
}
