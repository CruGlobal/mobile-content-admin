import {Component, Input, OnInit} from '@angular/core';
import {ResourceLanguage} from '../../../models/resource-language';
import {ResourceLanguageService} from '../../../service/resource/resource-language.service';
import {SystemService} from '../../../service/system.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractEditResourceLanguageComponent} from '../abstract-edit-resource-language.component';

@Component({
  selector: 'admin-edit-resource',
  templateUrl: '../edit-resource-language.component.html'
})
export class UpdateResourceLanguageComponent extends AbstractEditResourceLanguageComponent implements OnInit {
  @Input() resourceLanguage: ResourceLanguage;

  constructor(private resourceLanguageService: ResourceLanguageService,
              systemService: SystemService,
              activeModal: NgbActiveModal) {

    super(systemService, activeModal);  }

  ngOnInit(): void {
  }

  saveResourceLanguage(): void {
    this.saving = true;

    this.resourceLanguageService.update(this.resourceLanguage)
      .then(() => super.saveResourceLanguage())
      .catch(error => super.handleError(error));
  }
}
