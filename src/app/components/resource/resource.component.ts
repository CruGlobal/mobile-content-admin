import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Resource } from '../../models/resource';
import { Page } from '../../models/page';
import {
  NgbModal,
  NgbModalRef,
  NgbTypeahead,
} from '@ng-bootstrap/ng-bootstrap';
import { UpdateResourceComponent } from '../edit-resource/update-resource/update-resource.component';
import { MultipleDraftGeneratorComponent } from '../multiple-draft-generator/multiple-draft-generator.component';
import { LanguageService } from '../../service/language.service';
import { ResourcesComponent } from '../resources/resources.component';
import { PageComponent } from '../page/page.component';
import { CreatePageComponent } from '../create-page/create-page.component';
import { Observable, Subject } from 'rxjs';
import { Tip } from '../../models/tip';
import { TipComponent } from '../tip/tip.component';
import { CreateTipComponent } from '../create-tip/create-tip.component';
import { merge } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { Language } from '../../models/language';
import { Translation } from '../../models/translation';
import { getLatestTranslation } from '../translation/utilities';

interface LanguageSearchResult {
  language: Language;
  latestTranslation: Translation;
}

@Component({
  selector: 'admin-resource',
  templateUrl: './resource.component.html',
})
export class ResourceComponent implements OnInit, OnChanges, OnDestroy {
  @Input() resource: Resource;
  @Input() resourcesComponent: ResourcesComponent;

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  showDetails = false;
  selectedLanguage: LanguageSearchResult = undefined;
  errorMessage: string;

  private _translationLoaded = new Subject<number>();
  translationLoaded$ = this._translationLoaded.asObservable();

  constructor(
    private languageService: LanguageService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.loadTranslations();
  }

  ngOnChanges(pChanges: SimpleChanges): void {
    if (
      pChanges.resource &&
      pChanges.resource.previousValue &&
      pChanges.resource.currentValue
    ) {
      this.loadTranslations();
    }
  }

  ngOnDestroy(): void {
    this._translationLoaded.complete();
  }

  createPage(): void {
    const modal = this.modalService.open(CreatePageComponent, { size: 'lg' });
    modal.componentInstance.page.resource = this.resource;
    modal.result
      .then(() => this.resourcesComponent.loadResources())
      .catch(this.handleError.bind(this));
  }

  openPage(page: Page): void {
    const modal = this.modalService.open(PageComponent, { size: 'lg' });
    modal.componentInstance.page = page;
  }

  createTip(): void {
    const modal = this.modalService.open(CreateTipComponent, { size: 'lg' });
    modal.componentInstance.tip.resource = this.resource;
    modal.result
      .then(() => this.resourcesComponent.loadResources())
      .catch(this.handleError.bind(this));
  }

  openTip(tip: Tip): void {
    const modal = this.modalService.open(TipComponent, { size: 'lg' });
    modal.componentInstance.tip = tip;
  }

  openUpdateModal(resource: Resource): void {
    const modalRef: NgbModalRef = this.modalService.open(
      UpdateResourceComponent,
      { size: 'lg' },
    );
    modalRef.componentInstance.resource = resource;
    modalRef.result.then(
      () => this.resourcesComponent.loadResources(),
      console.log,
    );
  }

  openGenerateModal(resource: Resource): void {
    const modalRef: NgbModalRef = this.modalService.open(
      MultipleDraftGeneratorComponent,
    );
    modalRef.componentInstance.resource = resource;
    modalRef.result.then(
      () => this.resourcesComponent.loadResources(),
      console.log,
    );
  }

  onLoadResources(): void {
    this.resourcesComponent.loadResources();
  }

  private loadTranslations(): void {
    this.resource['latest-drafts-translations'].forEach((translation) => {
      this.languageService
        .getLanguage(translation.language.id, 'custom_pages,custom_tips')
        .then((language) => {
          translation.language = language;
          translation.is_published = translation['is-published'];
          setTimeout(() => {
            this._translationLoaded.next(translation.language.id);
          }, 0);
        })
        .catch(this.handleError.bind(this));
    });
  }

  private handleError(message): void {
    this.errorMessage = message;
  }

  languageSearch = (
    text$: Observable<string>,
  ): Observable<LanguageSearchResult[]> => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen()),
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((query) => {
        const terms = query.toLowerCase().split(' ');
        return this.resourcesComponent.languages
          .filter((language) =>
            terms.some(
              (term) =>
                language.name.toLowerCase().includes(term) ||
                language.code.toLowerCase().includes(term),
            ),
          )
          .map((language) => ({
            language,
            latestTranslation: getLatestTranslation(this.resource, language),
          }));
      }),
    );
  };

  languageFormatter = (result: LanguageSearchResult) =>
    `${result.language.name} (${result.language.code})`;
}
