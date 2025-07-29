import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourceLanguage } from '../../../models/resource-language';
import { ResourceLanguageService } from '../../../service/resource-language/resource-language.service';
import { SystemService } from '../../../service/system.service';
import { AbstractEditResourceLanguageComponent } from '../abstract-edit-resource-language.component';

@Component({
  selector: 'admin-edit-resource',
  templateUrl: '../edit-resource-language.component.html',
})
export class UpdateResourceLanguageComponent
  extends AbstractEditResourceLanguageComponent
  implements OnInit {
  @Input() resourceLanguage: ResourceLanguage;

  constructor(
    private resourceLanguageService: ResourceLanguageService,
    systemService: SystemService,
    activeModal: NgbActiveModal,
  ) {
    super(systemService, activeModal);
  }

  ngOnInit(): void {
    this.resourceLanguage.includeTips = false;
    this.resourceLanguageService
      .getResourceLanguage(this.resourceLanguage)
      .then((resourceLanguage) => {
        this.resourceLanguage.includeTips =
          resourceLanguage['attr-include-tips'] === 'true';
      });
  }

  saveResourceLanguage(): void {
    this.saving = true;

    this.resourceLanguageService
      .update(this.resourceLanguage)
      .then(() => super.saveResourceLanguage())
      .catch((error) => super.handleError(error));
  }
}
