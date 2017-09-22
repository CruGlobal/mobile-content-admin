import {Component, OnInit} from '@angular/core';
import {Resource} from '../../models/resource';
import {ResourceService} from '../../service/resource/resource.service';
import {LanguageService} from '../../service/language.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CreateResourceComponent} from '../edit-resource/create-resource/create-resource.component';
import {UpdateResourceComponent} from '../edit-resource/update-resource/update-resource.component';
import {MultipleDraftGeneratorComponent} from '../multiple-draft-generator/multiple-draft-generator.component';

@Component({
  selector: 'admin-resources',
  templateUrl: './resources.component.html'
})
export class ResourcesComponent implements OnInit {
  resources: Resource[];

  errorMessage: string;
  loading = false;
  showInstructions = false;

  constructor(private resourceService: ResourceService, private languageService: LanguageService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadResources();
  }

  private handleError(message): void {
    this.errorMessage = message;
  }

  loadResources(): void {
    this.loading = true;

    this.resourceService.getResources('translations,pages')
      .then(resources => {
        this.resources = resources;
        this.resources.forEach(r => (this.loadTranslations(r)));
      })
      .catch(this.handleError.bind(this))
      .then(() => this.loading = false);
  }

  openCreateModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(CreateResourceComponent);
    modalRef.result.then(() => this.loadResources(), console.log);
  }

  openUpdateModal(resource: Resource): void {
    const modalRef: NgbModalRef = this.modalService.open(UpdateResourceComponent);
    modalRef.componentInstance.resource = resource;
    modalRef.result.then(() => this.loadResources(), console.log);
  }

  openGenerateModal(resource: Resource): void {
    const modalRef: NgbModalRef = this.modalService.open(MultipleDraftGeneratorComponent);
    modalRef.componentInstance.resource = resource;
    modalRef.result.then(() => this.loadResources(), console.log);
  }

  private loadTranslations(resource): void {
    resource['latest-drafts-translations'].forEach((translation) => {
      this.languageService.getLanguage(translation.language.id, 'custom_pages')
        .then((language) => {
          translation.language = language;
          translation.is_published = translation['is-published'];
        })
        .catch(this.handleError.bind(this));
    });
  }
}
