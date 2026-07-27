import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  NgbModal,
  NgbModalRef,
  NgbTypeahead,
} from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { Language } from '../../models/language';
import { Page } from '../../models/page';
import { Resource } from '../../models/resource';
import { Tip } from '../../models/tip';
import { Translation } from '../../models/translation';
import { LanguageService } from '../../service/language.service';
import { PageService } from '../../service/page.service';
import { CreatePageComponent } from '../create-page/create-page.component';
import { CreateTipComponent } from '../create-tip/create-tip.component';
import { UpdateResourceComponent } from '../edit-resource/update-resource/update-resource.component';
import { MultipleDraftGeneratorComponent } from '../multiple-draft-generator/multiple-draft-generator.component';
import { PageComponent } from '../page/page.component';
import { ResourcesComponent } from '../resources/resources.component';
import { TipComponent } from '../tip/tip.component';
import { TranslateAttributesComponent } from '../translate-attributes/translate-attributes.component';
import { getLatestTranslation } from '../translation/utilities';

interface LanguageSearchResult {
  language: Language;
  latestTranslation: Translation;
}

@Component({
  selector: 'admin-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css'],
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
  pages: Page[] = [];
  pageErrorMessage: string = null;
  saving = false;
  renamingPage: Page = null;
  renameValue = '';

  private _translationLoaded = new Subject<number>();
  translationLoaded$ = this._translationLoaded.asObservable();

  constructor(
    private languageService: LanguageService,
    private modalService: NgbModal,
    private pageService: PageService,
  ) {}

  ngOnInit(): void {
    this.sortPages();
    this.loadTranslations();
  }

  ngOnChanges(pChanges: SimpleChanges): void {
    if (
      pChanges.resource &&
      pChanges.resource.previousValue &&
      pChanges.resource.currentValue
    ) {
      this.sortPages();
      this.loadTranslations();
    }
  }

  ngOnDestroy(): void {
    this._translationLoaded.complete();
  }

  isMetaTool(): boolean {
    return Resource.isMetaTool(this.resource);
  }

  onPageDrop(event: CdkDragDrop<Page[]>): void {
    if (this.saving) {
      return;
    }
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const previousOrder = [...this.pages];
    moveItemInArray(this.pages, event.previousIndex, event.currentIndex);
    this.saving = true;
    this.pageService
      .reorder(
        this.resource.id,
        this.pages.map((page) => page.id),
      )
      .then(() => {
        this.pages.forEach((page, index) => {
          page.position = index;
        });
        this.resource.pages = [...this.pages];
        this.pageErrorMessage = null;
      })
      .catch((message) => {
        this.pages = previousOrder;
        this.pageErrorMessage = message;
      })
      .then(() => {
        this.saving = false;
      });
  }

  startRenamePage(page: Page): void {
    this.renamingPage = page;
    this.renameValue = page.filename;
    this.pageErrorMessage = null;
  }

  cancelRenamePage(): void {
    this.renamingPage = null;
    this.pageErrorMessage = null;
  }

  saveRenamePage(page: Page): void {
    const filename = this.renameValue.trim();
    if (!filename || filename === page.filename) {
      this.cancelRenamePage();
      return;
    }
    this.saving = true;
    this.pageService
      .update(page.id, { filename })
      .then(() => {
        page.filename = filename;
        this.renamingPage = null;
      })
      .catch((message) => {
        this.pageErrorMessage = message;
      })
      .then(() => {
        this.saving = false;
      });
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

  openAttributeTranslationsModal(resource: Resource): void {
    const modalRef: NgbModalRef = this.modalService.open(
      TranslateAttributesComponent,
      { size: 'lg' },
    );

    modalRef.componentInstance.resourceId = resource.id;
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

  private sortPages(): void {
    this.pages = [...(this.resource.pages || [])].sort(
      (a, b) => a.position - b.position,
    );
    if (this.renamingPage) {
      this.renamingPage =
        this.pages.find((page) => page.id === this.renamingPage.id) || null;
    }
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
