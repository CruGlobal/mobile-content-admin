import {Component, OnInit} from '@angular/core';
import {Resource} from '../../models/resource';
import {ResourceService} from '../../service/resource.service';
import {LanguageService} from '../../service/language.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateResourceComponent} from '../edit-resource/create-resource.component';
import {UpdateResourceComponent} from '../edit-resource/update-resource.component';

@Component({
  selector: 'admin-resources',
  templateUrl: './resources.component.html'
})
export class ResourcesComponent implements OnInit {
  resources: Resource[];

  constructor(private resourceService: ResourceService, private languageService: LanguageService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.resourceService.getResources(null).then(resources => this.resources = resources);
  }

  openCreateModal(): void {
    this.modalService.open(CreateResourceComponent);
  }

  openUpdateModal(resource: Resource): void {
    this.modalService.open(UpdateResourceComponent).componentInstance.resource = resource;
  }

  loadTranslations(resource): void {
    this.resourceService.getResource(resource.id, 'translations,pages').then((r) => {
      resource.latest = r['latest-drafts-translations'];

      resource.latest.forEach((translation, index) => {
        this.languageService.getLanguage(translation.language.id, 'custom_pages').then((language) => {
          translation.language = language;
          translation.is_published = translation['is-published'];

          if (index === resource.latest.length - 1) {
            resource.showTranslations = true;
          }
        });
      });
    });
  }
}
