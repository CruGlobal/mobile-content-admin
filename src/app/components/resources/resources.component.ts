import {Component, OnInit} from '@angular/core';
import {Resource} from '../../models/resource';
import {ResourceService} from '../../service/resource/resource.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CreateResourceComponent} from '../edit-resource/create-resource/create-resource.component';
import {Language} from '../../models/language';
import {LanguageService} from '../../service/language.service';

@Component({
  selector: 'admin-resources',
  templateUrl: './resources.component.html'
})
export class ResourcesComponent implements OnInit {
  resources: Resource[];
  languages: Language[];

  private errorMessage: string;
  private loadingResources = false;
  private loadingLanguages = false;

  constructor(private resourceService: ResourceService, private languageService: LanguageService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadResources();
    this.loadLanguages();
  }

  loadResources(): void {
    this.loadingResources = true;

    this.resourceService.getResources('translations,pages,custom-manifests')
      .then(resources => {
        this.resources = resources;
      })
      .catch(this.handleError.bind(this))
      .then(() => this.loadingResources = false);
  }

  openCreateModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(CreateResourceComponent);
    modalRef.result.then(() => this.loadResources(), console.log);
  }

  trackByFunction(pIx: number, pItem: Resource) {
    if (!pItem || pIx < 0) {
      return null;
    }
    return pItem.id;
  }

  private loadLanguages(): void {
    this.loadingLanguages = true;
    this.languageService.getLanguages()
      .then(languages => this.languages = languages)
      .catch(this.handleError.bind(this))
      .then(() => this.loadingLanguages = false);
  }

  private handleError(message): void {
    this.errorMessage = message;
  }
}
