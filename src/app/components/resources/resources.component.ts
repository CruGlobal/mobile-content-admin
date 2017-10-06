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
  private loading = false;

  constructor(private resourceService: ResourceService, private languageService: LanguageService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadResources();
    this.loadLanguages(); // TODO wait for this to finish also before removing loading
  }

  loadResources(): void {
    this.loading = true;

    this.resourceService.getResources('translations,pages')
      .then(resources => {
        this.resources = resources;
      })
      .catch(this.handleError.bind(this))
      .then(() => this.loading = false);
  }

  openCreateModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(CreateResourceComponent);
    modalRef.result.then(() => this.loadResources(), console.log);
  }

  private loadLanguages(): void {
    this.languageService.getLanguages()
      .then(languages => this.languages = languages)
      .catch(this.handleError.bind(this));
  }

  private handleError(message): void {
    this.errorMessage = message;
  }

}
