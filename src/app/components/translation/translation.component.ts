import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AbstractPage } from '../../models/abstract-page';
import { AbstractTip } from '../../models/abstract-tip';
import { CustomManifest } from '../../models/custom-manifest';
import { CustomPage } from '../../models/custom-page';
import { CustomTip } from '../../models/custom-tip';
import { Language } from '../../models/language';
import { MessageType } from '../../models/message';
import { Page } from '../../models/page';
import { Resource } from '../../models/resource';
import { Tip } from '../../models/tip';
import { Translation } from '../../models/translation';
import { CustomManifestService } from '../../service/custom-manifest.service';
import { CustomPageService } from '../../service/custom-page.service';
import { CustomTipService } from '../../service/custom-tip.service';
import { DraftService } from '../../service/draft.service';
import { ResourceService } from '../../service/resource/resource.service';
import { CustomManifestComponent } from '../custom-manifest/custom-manifest.component';
import { CustomPageComponent } from '../custom-page/custom-page.component';
import { CustomTipComponent } from '../custom-tip/custom-tip.component';
import { UpdateResourceLanguageComponent } from '../edit-resource-language/update-resource-language/update-resource-language.component';
import { getLatestTranslation } from './utilities';

@Component({
  selector: 'admin-translation',
  templateUrl: './translation.component.html',
})
export class TranslationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() language: Language;
  @Input() resource: Resource;
  @Input() translationLoaded: Observable<number>;
  @Output() loadResources = new EventEmitter<any>();

  translation: Translation;
  customManifest: CustomManifest;
  baseDownloadUrl = environment.base_url + 'translations/';
  errorMessage: string;
  alertMessage: string;
  sucessfulMessage: string;
  checkToEnsureDraftIsPublished: number;
  successfullyPublishedMessage = 'Language has been successfully published.';

  constructor(
    private customPageService: CustomPageService,
    private customTipService: CustomTipService,
    private draftService: DraftService,
    private customManifestService: CustomManifestService,
    private modalService: NgbModal,
    private resourceService: ResourceService,
  ) {}

  ngOnInit(): void {
    this.translation = getLatestTranslation(this.resource, this.language);
    this.customManifest = this.getCustomManifest();
    this.translationLoaded.subscribe((langId) => {
      if (langId === this.language.id) {
        this.reloadTranslation();
      }
    });
  }

  ngOnChanges(pChanges: SimpleChanges): void {
    if (
      pChanges.resource &&
      pChanges.resource.previousValue &&
      pChanges.resource.currentValue
    ) {
      this.customManifest = this.getCustomManifest();
    }
  }

  ngOnDestroy() {
    clearInterval(this.checkToEnsureDraftIsPublished);
  }

  getPages(): AbstractPage[] {
    const _tPages = this.translation.resource.pages.map((page) => {
      const customPage: CustomPage = this.translation.language[
        'custom-pages'
      ].find((c) => c.page && c.page.id === page.id);
      if (!customPage) {
        return page;
      } else {
        customPage.page = page;
        return customPage;
      }
    });
    return _tPages;
  }

  getTips(): AbstractTip[] {
    const _tTips = this.translation.resource.tips.map((tip) => {
      const customTip: CustomTip = this.translation.language[
        'custom-tips'
      ].find((c) => c.tip && c.tip.id === tip.id);
      if (!customTip) {
        return tip;
      } else {
        customTip.tip = tip;
        return customTip;
      }
    });
    return _tTips;
  }

  reloadTranslation(): void {
    this.translation = getLatestTranslation(this.resource, this.language);
  }

  pagesTrackBy(pIx: number, pItem: AbstractPage): any {
    if (!pItem || pIx < 0) {
      return null;
    }
    return pItem.id;
  }

  tipsTrackBy(tIx: number, tItem: AbstractTip): any {
    if (!tItem || tIx < 0) {
      return null;
    }
    return tItem.id;
  }

  getBasePage(page: AbstractPage): Page {
    if (page['_type'] === 'custom-page') {
      return (page as CustomPage).page;
    }
    return page as Page;
  }

  getBaseTip(tip: AbstractTip): Tip {
    if (tip['_type'] === 'custom-tip') {
      return (tip as CustomTip).tip;
    }
    return tip as Tip;
  }

  renderMessage(type: MessageType, text: string, time?: number) {
    this[`${type}Message`] = text;
    if (time) {
      setTimeout(() => {
        this[`${type}Message`] = '';
      }, time);
    }
  }

  async publish(): Promise<void> {
    this.renderMessage(MessageType.error, '');
    this.renderMessage(MessageType.success, 'Publishing...');
    this.draftService
      .publishDraft(this.resource, this.translation)
      .then((data) => {
        const publishingError = data[0]['publishing-errors'];
        if (publishingError) {
          this.renderMessage(MessageType.success, publishingError);
        }
        this.checkToEnsureDraftIsPublished = window.setInterval(() => {
          this.isPublished();
        }, 5000);
      })
      .catch(this.handleError.bind(this));
  }

  isPublished() {
    try {
      this.resourceService
        .getResource(this.resource.id, 'latest-drafts-translations')
        .then((resource) => {
          const translation = resource['latest-drafts-translations'].find(
            (draftTranslation) =>
              draftTranslation.language.id === this.translation.language.id,
          );
          if (translation['publishing-errors']) {
            clearInterval(this.checkToEnsureDraftIsPublished);
            this.renderMessage(MessageType.success, null);
            this.renderMessage(
              MessageType.error,
              translation['publishing-errors'],
            );
          }
          if (translation['is-published']) {
            clearInterval(this.checkToEnsureDraftIsPublished);
            this.renderMessage(MessageType.error, null);
            this.renderMessage(
              MessageType.success,
              this.successfullyPublishedMessage,
            );
            this.loadAllResources();
          }
        });
    } catch (err) {
      console.log('ERROR', err);
      clearInterval(this.checkToEnsureDraftIsPublished);
      this.renderMessage(MessageType.success, null);
      this.renderMessage(MessageType.error, err.message);
    }
  }

  createCustomPage(page: Page): void {
    const customPage = new CustomPage();
    customPage.page = page;
    customPage.language = this.translation.language;
    customPage.structure = page.structure;

    const modal = this.modalService.open(CustomPageComponent, { size: 'lg' });
    modal.componentInstance.customPage = customPage;
    modal.componentInstance.translation = this.translation;
    modal.result
      .then(this.loadAllResources.bind(this))
      .catch(this.handleError.bind(this));
  }

  createCustomTip(tip: Tip): void {
    const customTip = new CustomTip();
    customTip.tip = tip;
    customTip.language = this.translation.language;
    customTip.structure = tip.structure;

    const modal = this.modalService.open(CustomTipComponent, { size: 'lg' });
    modal.componentInstance.customTip = customTip;
    modal.componentInstance.translation = this.translation;
    modal.result
      .then(this.loadAllResources.bind(this))
      .catch(this.handleError.bind(this));
  }

  openCustomPage(customPage: CustomPage): void {
    const modal = this.modalService.open(CustomPageComponent, { size: 'lg' });
    modal.componentInstance.customPage = customPage;
    modal.componentInstance.translation = this.translation;
  }

  openCustomTip(customTip: CustomTip): void {
    const modal = this.modalService.open(CustomTipComponent, { size: 'lg' });
    modal.componentInstance.customTip = customTip;
    modal.componentInstance.translation = this.translation;
  }

  deleteCustomPage(customPage: CustomPage): void {
    this.customPageService
      .delete(customPage.id)
      .then(() => this.loadAllResources())
      .catch(this.handleError.bind(this));
  }

  deleteCustomTip(customTip: CustomTip): void {
    this.customTipService
      .delete(customTip.id)
      .then(() => this.loadAllResources())
      .catch(this.handleError.bind(this));
  }

  editCustomManifest(): void {
    let manifest;
    if (typeof this.customManifest === 'undefined') {
      manifest = new CustomManifest();
      manifest.resource = this.resource;
      manifest.language = this.language;
      manifest.structure = this.resource.manifest;
    } else {
      manifest = CustomManifest.copy(this.customManifest);
    }

    const modal = this.modalService.open(CustomManifestComponent, {
      size: 'lg',
    });
    modal.componentInstance.customManifest = manifest;
    modal.result
      .then((customManifest) => {
        this.customManifest = customManifest;
      })
      .catch(() => {
        // Modal cancelled: Do nothing, manifest has original structure
      });
  }

  openResourceLanguage(): void {
    const modal = this.modalService.open(UpdateResourceLanguageComponent, {
      size: 'lg',
    });
    modal.componentInstance.resourceLanguage.language = this.language;
    modal.componentInstance.resourceLanguage.resource = this.resource;
    // TODO
    // modal.componentInstance.translation = this.translation;
  }

  deleteCustomManifest(): void {
    if (
      typeof this.customManifest === 'undefined' ||
      typeof this.customManifest.id === 'undefined'
    ) {
      return;
    }
    this.customManifestService
      .delete(this.customManifest.id)
      .then(() => this.loadAllResources())
      .catch(this.handleError.bind(this));
  }

  private getCustomManifest(): CustomManifest {
    return this.resource['custom-manifests'].find(
      (m) => m.language.id === this.language.id,
    );
  }

  private loadAllResources() {
    this.loadResources.emit();
  }

  private handleError(message: string): void {
    this.errorMessage = message;
  }
}
