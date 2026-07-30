import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
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
import { ResourceService } from '../../service/resource/resource.service';
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
export class ResourceComponent implements OnChanges, OnDestroy {
  @Input() resource: Resource;
  @Input() resourcesComponent: ResourcesComponent;

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  showDetails = false;
  detailsLoaded = false;
  loadingDetails = false;
  // The in-flight detail request, shared by every caller.
  private detailsLoad: Promise<boolean> | null = null;
  selectedLanguage: LanguageSearchResult = undefined;
  errorMessage: string | null = null;
  pages: Page[] = [];
  pageErrorMessage: string = null;
  saving = false;
  renamingPage: Page = null;
  renameValue = '';

  private static readonly DETAIL_RELATIONSHIPS = [
    'latest-drafts-translations',
    'pages',
    'custom-manifests',
    'tips',
    'attachments',
    'variants',
  ];

  private _translationLoaded = new Subject<number>();
  translationLoaded$ = this._translationLoaded.asObservable();

  constructor(
    private languageService: LanguageService,
    private modalService: NgbModal,
    private pageService: PageService,
    private resourceService: ResourceService,
  ) {}

  ngOnChanges(pChanges: SimpleChanges): void {
    const change = pChanges.resource;
    if (!change || !change.previousValue || !change.currentValue) {
      return;
    }

    if (this.isMetaTool()) {
      // Metatools have no detail body to load.
      this.showDetails = false;
      this.detailsLoaded = false;
      return;
    }
    if (!this.detailsLoaded) {
      return;
    }
    if (this.showDetails) {
      // Carry the details we already have onto the new resource so the open
      // panel keeps rendering while the fresh details are fetched, instead of
      // blanking out for the length of the request.
      ResourceComponent.copyDetails(change.previousValue, this.resource);
      this.loadDetails();
    } else {
      // Nothing is rendered, so drop the stale details and reload on next expand.
      this.detailsLoaded = false;
    }
  }

  ngOnDestroy(): void {
    this._translationLoaded.complete();
  }

  toggleDetails(): void {
    if (this.isMetaTool()) {
      return;
    }
    if (this.showDetails) {
      this.showDetails = false;
      return;
    }
    if (this.detailsLoaded) {
      // Don't reload the details if they have already been loaded
      this.showDetails = true;
      return;
    }
    this.loadDetails().then((loaded) => {
      if (!loaded) {
        // loadDetails has expanded the resource to show the error
        return;
      }

      // The content is rendered but still collapsed, so open on the next
      // animation frame — after the body has laid out — so ngbCollapse measures
      // a fully-rendered element and slides smoothly instead of measuring it
      // mid-render and snapping.
      requestAnimationFrame(() => {
        this.showDetails = true;
      });
    });
  }

  /**
   * Resolves to whether the details are available: a failed load leaves them
   * unloaded, and callers must not act on a resource without its details.
   */
  loadDetails(): Promise<boolean> {
    if (this.detailsLoad) {
      // The details are already loading, so reuse the promise.
      return this.detailsLoad;
    }

    this.loadingDetails = true;
    this.errorMessage = null;
    this.detailsLoad = this.resourceService
      .getResource(
        this.resource.id,
        ResourceComponent.DETAIL_RELATIONSHIPS.join(','),
      )
      .then((resource) =>
        // Hydrate the draft translations' languages before publishing the
        // details, so the detail body is never rendered against the
        // relationship stubs the resource response contains.
        this.loadTranslations(resource).then(() => {
          Object.assign(this.resource, resource);
          this.sortPages();
          this.detailsLoaded = true;
          if (this.selectedLanguage) {
            this._translationLoaded.next(this.selectedLanguage.language.id);
          }
        }),
      )
      .catch((message) => {
        this.handleError(message);
        this.showDetails = true;
        this.detailsLoaded = false;
      })
      .then(() => {
        this.loadingDetails = false;
        this.detailsLoad = null;
        return this.detailsLoaded;
      });
    return this.detailsLoad;
  }

  reloadDetails(): Promise<boolean> {
    return this.loadDetails();
  }

  private ensureDetailsLoaded(): Promise<boolean> {
    return this.detailsLoaded ? Promise.resolve(true) : this.loadDetails();
  }

  private static copyDetails(from: Resource, to: Resource): void {
    ResourceComponent.DETAIL_RELATIONSHIPS.forEach((relationship) => {
      to[relationship] = from[relationship];
    });
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
      .then(() => this.reloadDetails())
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
      .then(() => this.reloadDetails())
      .catch(this.handleError.bind(this));
  }

  openTip(tip: Tip): void {
    const modal = this.modalService.open(TipComponent, { size: 'lg' });
    modal.componentInstance.tip = tip;
  }

  openUpdateModal(resource: Resource): void {
    this.ensureDetailsLoaded().then((loaded) => {
      if (!loaded) {
        // The resource will expand and show the error message
        return;
      }
      const modalRef: NgbModalRef = this.modalService.open(
        UpdateResourceComponent,
        { size: 'lg' },
      );
      modalRef.componentInstance.resource = resource;
      modalRef.result.then(
        () => this.resourcesComponent.loadResources(),
        console.log,
      );
    });
  }

  openAttributeTranslationsModal(resource: Resource): void {
    const modalRef: NgbModalRef = this.modalService.open(
      TranslateAttributesComponent,
      { size: 'lg' },
    );

    modalRef.componentInstance.resourceId = resource.id;
    modalRef.result.then(() => {
      // Only refresh open panels
      if (this.detailsLoaded) {
        this.reloadDetails();
      }
    }, console.log);
  }

  openGenerateModal(resource: Resource): void {
    this.ensureDetailsLoaded().then((loaded) => {
      if (!loaded) {
        // The resource will expand and show the error message
        return;
      }
      const modalRef: NgbModalRef = this.modalService.open(
        MultipleDraftGeneratorComponent,
      );
      modalRef.componentInstance.resource = resource;
      modalRef.result.then(() => this.reloadDetails(), console.log);
    });
  }

  onLoadResources(): void {
    this.reloadDetails();
  }

  private loadTranslations(resource: Resource): Promise<void> {
    const translations = resource['latest-drafts-translations'] || [];
    return Promise.all(
      translations.map((translation) =>
        this.languageService
          .getLanguage(translation.language.id, 'custom_pages,custom_tips')
          .then((language) => {
            translation.language = language;
            translation.is_published = translation['is-published'];
          })
          .catch(this.handleError.bind(this)),
      ),
    ).then(() => undefined);
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
