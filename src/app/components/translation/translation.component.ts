import {Component, Input, OnInit} from '@angular/core';
import {Translation} from '../../models/translation';
import {DraftService} from '../../service/draft.service';
import {CustomPage} from '../../models/custom-page';
import {AbstractPage} from '../../models/abstract-page';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PageComponent} from '../page/page.component';
import {CustomPageComponent} from '../custom-page/custom-page.component';
import {Page} from '../../models/page';
import {ResourceComponent} from '../resource/resource.component';
import {Language} from '../../models/language';
import {CustomPageService} from '../../service/custom-page.service';

@Component({
  selector: 'admin-translation',
  templateUrl: './translation.component.html',
})
export class TranslationComponent implements OnInit {
  @Input() language: Language;
  @Input() resourceComponent: ResourceComponent;

  translation: Translation;

  private publishing = false;
  private saving = false;
  private errorMessage: string;

  constructor(private customPageService: CustomPageService, private draftService: DraftService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.translation = this.getLatestTranslation(this.language);
  }

  getPages(): AbstractPage[] {
    return this.resourceComponent.sortedPages().map(page => {
      const customPage: CustomPage = this.translation.language['custom-pages'].find(c => c.page.id === page.id);

      if (!customPage) {
        return page;
      } else {
        customPage.page = page;
        return customPage;
      }
    });
  }

  getBasePage(page: AbstractPage): Page {
    if (page['_type'] === 'custom-page') {
      return (page as CustomPage).page;
    }
    return page as Page;
  }

  showPages(): void {
    this.translation.resource.translations.forEach(t => ( t.show = false ));
    this.translation.show = true;
  }

  hidePages(): void {
    this.translation.show = false;
  }

  publishDraft(): void {
    this.publishing = true;
    this.errorMessage = null;

    const t = Translation.copy(this.translation);
    t.is_published = true;

    this.draftService.updateDraft(t)
      .then(() => this.loadAllResources())
      .catch(this.handleError.bind(this))
      .then(() => this.publishing = false);
  }

  createDraft(): void {
    this.saving = true;
    this.errorMessage = null;

    this.draftService.createDraft(this.translation)
      .then(() => this.loadAllResources())
      .catch(this.handleError.bind(this))
      .then(() => this.saving = false);
  }

  createCustomPage(page: Page): void {
    const modal = this.modalService.open(PageComponent, {size: 'lg'});
    modal.componentInstance.page = page;
    modal.componentInstance.translation = this.translation;
    modal.result
      .then(this.loadAllResources.bind(this))
      .catch(this.handleError.bind(this));
  }

  openCustomPage(customPage: CustomPage): void {
    const modal = this.modalService.open(CustomPageComponent, {size: 'lg'});
    modal.componentInstance.customPage = customPage;
    modal.componentInstance.translation = this.translation;
  }

  deleteCustomPage(customPage: CustomPage): void {
    this.customPageService.delete(customPage.id)
      .then(() => this.loadAllResources())
      .catch(this.handleError.bind(this));
  }

  private getLatestTranslation(language: Language): Translation {
    let latest = this.resourceComponent.resource['latest-drafts-translations'].find(t => t.language.id === language.id);
    if (!latest) {
      latest = new Translation();
      latest.language = language;
      latest.resource = this.resourceComponent.resource;
      latest.none = true;
    }

    return latest;
  }

  private loadAllResources() {
    this.resourceComponent.resourcesComponent.loadResources();
  }

  private handleError(message: string): void {
    this.errorMessage = message;
  }
}
