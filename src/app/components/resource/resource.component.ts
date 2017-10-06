import {Component, Input, OnInit} from '@angular/core';
import {Resource} from '../../models/resource';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UpdateResourceComponent} from '../edit-resource/update-resource/update-resource.component';
import {MultipleDraftGeneratorComponent} from '../multiple-draft-generator/multiple-draft-generator.component';
import {LanguageService} from '../../service/language.service';
import {ResourcesComponent} from '../resources/resources.component';
import {Translation} from '../../models/translation';

@Component({
  selector: 'admin-resource',
  templateUrl: './resource.component.html'
})
export class ResourceComponent implements OnInit {
  @Input() resource: Resource;
  @Input() resourcesComponent: ResourcesComponent;

  private errorMessage: string;

  constructor(private languageService: LanguageService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadTranslations();
  }

  openUpdateModal(resource: Resource): void {
    const modalRef: NgbModalRef = this.modalService.open(UpdateResourceComponent);
    modalRef.componentInstance.resource = resource;
    modalRef.result.then(() => this.resourcesComponent.loadResources(), console.log);
  }

  openGenerateModal(resource: Resource): void {
    const modalRef: NgbModalRef = this.modalService.open(MultipleDraftGeneratorComponent);
    modalRef.componentInstance.resource = resource;
    modalRef.result.then(() => this.resourcesComponent.loadResources(), console.log);
  }

  private loadTranslations(): void {
    this.resource['latest-drafts-translations'].forEach((translation) => {
      this.languageService.getLanguage(translation.language.id, 'custom_pages')
        .then((language) => {
          translation.language = language;
          translation.is_published = translation['is-published'];
        })
        .catch(this.handleError.bind(this));
    });
  }

  private handleError(message): void {
    this.errorMessage = message;
  }
}
