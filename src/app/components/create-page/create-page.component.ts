import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Page } from '../../models/page';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PageService } from '../../service/page.service';
import { AceEditorDirective } from 'ng2-ace-editor';

@Component({
  selector: 'admin-create-page',
  templateUrl: './create-page.component.html',
})
export class CreatePageComponent implements OnDestroy {
  @Input() page: Page = new Page();

  @ViewChild(AceEditorDirective) editor;

  saving = false;
  errorMessage: string;

  constructor(
    private pageService: PageService,
    private activeModal: NgbActiveModal,
  ) {}

  savePage(): void {
    this.errorMessage = null;
    this.saving = true;

    this.pageService
      .create(this.page)
      .then(() => this.activeModal.close())
      .catch((message) => (this.errorMessage = message))
      .then(() => (this.saving = false));
  }

  dismissModal(): void {
    this.activeModal.dismiss('dismissed create page modal');
  }

  ngOnDestroy(): void {
    // HACK: workaround this bug: https://github.com/ajaxorg/ace/issues/4042
    //       ng2-ace-editor bundles an older version of ace that doesn't have this fix
    this.editor.editor.renderer.freeze();
  }
}
