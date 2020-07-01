import {Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {Resource} from '../../models/resource';
import {Page} from '../../models/page';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UpdateResourceComponent} from '../edit-resource/update-resource/update-resource.component';
import {MultipleDraftGeneratorComponent} from '../multiple-draft-generator/multiple-draft-generator.component';
import {LanguageService} from '../../service/language.service';
import {ResourcesComponent} from '../resources/resources.component';
import {PageComponent} from '../page/page.component';
import {CreatePageComponent} from '../create-page/create-page.component';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'admin-resource',
  templateUrl: './resource.component.html'
})
export class ResourceComponent implements OnInit, OnChanges, OnDestroy {
  @Input() resource: Resource;
  @Input() resourcesComponent: ResourcesComponent;

  showLanguages = false;
  showDefaultPages = false;
  errorMessage: string;

  private _translationLoaded = new Subject<number>();
  translationLoaded$ = this._translationLoaded.asObservable();

  constructor(private languageService: LanguageService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadTranslations();
  }

  ngOnChanges(pChanges: SimpleChanges): void {
    if (pChanges.resource && pChanges.resource.previousValue && pChanges.resource.currentValue) {
      this.loadTranslations();
    }
  }

  ngOnDestroy(): void {
    this._translationLoaded.complete();
  }

  createPage(): void {
    const modal = this.modalService.open(CreatePageComponent, {size: 'lg'});
    modal.componentInstance.page.resource = this.resource;
    modal.result
      .then(() => this.resourcesComponent.loadResources())
      .catch(this.handleError.bind(this));
  }

  openPage(page: Page): void {
    const modal = this.modalService.open(PageComponent, {size: 'lg'});
    modal.componentInstance.page = page;
  }

  openUpdateModal(resource: Resource): void {
    const modalRef: NgbModalRef = this.modalService.open(UpdateResourceComponent, {size: 'lg'});
    modalRef.componentInstance.resource = resource;
    modalRef.result.then(() => this.resourcesComponent.loadResources(), console.log);
  }

  openGenerateModal(resource: Resource): void {
    const modalRef: NgbModalRef = this.modalService.open(MultipleDraftGeneratorComponent);
    modalRef.componentInstance.resource = resource;
    modalRef.result.then(() => this.resourcesComponent.loadResources(), console.log);
  }

  onLoadResources(): void {
    this.resourcesComponent.loadResources();
  }

  private loadTranslations(): void {
    this.resource['latest-drafts-translations'].forEach((translation) => {
      this.languageService.getLanguage(translation.language.id, 'custom_pages')
        .then((language) => {
          translation.language = language;
          translation.is_published = translation['is-published'];
          setTimeout(() => {this._translationLoaded.next(translation.language.id); }, 0);
        })
        .catch(this.handleError.bind(this));
    });
  }

  private handleError(message): void {
    this.errorMessage = message;
  }
}
