import {Component, OnInit} from '@angular/core';
import {Resource} from '../../models/resource';
import {ResourceService} from '../../service/resource.service';
import {LanguageService} from '../../service/language.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CreateResourceComponent} from '../edit-resource/create-resource.component';
import {UpdateResourceComponent} from '../edit-resource/update-resource.component';

@Component({
  selector: 'admin-resources',
  templateUrl: './resources.component.html'
})
export class ResourcesComponent implements OnInit {
  resources: Resource[];
  private error = false;

  constructor(private resourceService: ResourceService, private languageService: LanguageService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadResources();
  }

  private handleError(error: any): void {
    console.error(error);
    this.error = true;
  }

  private loadResources(): void {
    this.resourceService.getResources('translations,pages').then(resources => {
      this.resources = resources;
      this.resources.forEach(r => (this.loadTranslations(r)));
    });
  }

  openCreateModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(CreateResourceComponent);
    modalRef.result.then(() => this.loadResources(), error => console.log(error));
  }

  openUpdateModal(resource: Resource): void {
    const modalRef: NgbModalRef = this.modalService.open(UpdateResourceComponent);
    modalRef.componentInstance.resource = resource;
    modalRef.result.then(() => this.loadResources(), error => console.log(error));
  }

  loadTranslations(resource): void {
    resource['latest-drafts-translations'].forEach((translation) => {
      this.languageService.getLanguage(translation.language.id, 'custom_pages').then((language) => {
        translation.language = language;
        translation.is_published = translation['is-published'];
      })
        .catch(error => this.handleError(error));
    });
  }
}
