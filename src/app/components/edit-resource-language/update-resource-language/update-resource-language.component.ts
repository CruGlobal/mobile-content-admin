import {Component, Input, OnInit} from '@angular/core';
import {System} from '../../../models/system';
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
  systems: System[];

  constructor(private resourceLanguageService: ResourceLanguageService,
              systemService: SystemService,
              activeModal: NgbActiveModal) {

    super(systemService, activeModal);  }

  ngOnInit(): void {
    super.init(
      () => this.resourceLanguage.system = this.systems.find(system => system.id === this.resourceLanguage.system.id)
    );
  }

  saveResourceLanguage(): void {
    this.saving = true;

    this.resourceLanguageService.update(this.resourceLanguage)
      .then(() => super.saveResourceLanguage())
      .catch(error => super.handleError(error));
  }
}
