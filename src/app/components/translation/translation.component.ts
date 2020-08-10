import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Translation } from '../../models/translation';
import { DraftService } from '../../service/draft.service';
import { CustomPage } from '../../models/custom-page';
import { CustomTip } from '../../models/custom-tip';
import { AbstractPage } from '../../models/abstract-page';
import { AbstractTip } from '../../models/abstract-tip';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomPageComponent } from '../custom-page/custom-page.component';
import { CustomTipComponent } from '../custom-tip/custom-tip.component';
import { UpdateResourceLanguageComponent } from '../edit-resource-language/update-resource-language/update-resource-language.component';
import { Page } from '../../models/page';
import { Tip } from '../../models/tip';
import { Language } from '../../models/language';
import { CustomPageService } from '../../service/custom-page.service';
import { CustomTipService } from '../../service/custom-tip.service';
import { CustomManifest } from '../../models/custom-manifest';
import { CustomManifestService } from '../../service/custom-manifest.service';
import { CustomManifestComponent } from '../custom-manifest/custom-manifest.component';
import { Resource } from '../../models/resource';
import { Observable } from 'rxjs';
import { getLatestTranslation } from './utilities';

@Component({
  selector: 'admin-translation',
  templateUrl: './translation.component.html',
})
export class TranslationComponent implements OnInit, OnChanges {
  @Input() language: Language;
  @Input() resource: Resource;
  @Input() translationLoaded: Observable<number>;
  @Output() loadResources = new EventEmitter<any>();

  translation: Translation;
  customManifest: CustomManifest;

  saving = false;
  publishing = false;
  errorMessage: string;

  constructor(
    private customPageService: CustomPageService,
    private customTipService: CustomTipService,
    private draftService: DraftService,
    private customManifestService: CustomManifestService,
    private modalService: NgbModal,
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

  publishDraft(): void {
    this.publishing = true;
    this.errorMessage = null;

    const t = Translation.copy(this.translation);
    t.is_published = true;

    this.draftService
      .updateDraft(t)
      .then(() => this.loadAllResources())
      .catch(this.handleError.bind(this))
      .then(() => (this.publishing = false));
  }

  createDraft(): void {
    this.saving = true;
    this.errorMessage = null;

    this.draftService
      .createDraft(this.translation)
      .then(() => this.loadAllResources())
      .catch(this.handleError.bind(this))
      .then(() => (this.saving = false));
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
