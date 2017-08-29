import {Component, Input} from '@angular/core';
import {Translation} from '../../models/translation';
import {DraftService} from '../../service/draft.service';
import {CustomPage} from '../../models/custom-page';
import {AbstractPage} from '../../models/abstract-page';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PageComponent} from '../page/page.component';
import {CustomPageComponent} from '../custom-page/custom-page.component';
import {Page} from '../../models/page';
import {CreatePageComponent} from '../create-page/create-page.component';
import {ResourcesComponent} from '../resources/resources.component';

@Component({
  selector: 'admin-translation',
  templateUrl: './translation.component.html',
})
export class TranslationComponent {
  @Input() translation: Translation;
  @Input() resourcesComponent: ResourcesComponent;

  private publishing = false;
  private saving = false;
  private errorMessage: string;

  constructor(private draftService: DraftService, private modalService: NgbModal) {}

  getPages(): AbstractPage[] {
    return this.translation.resource.pages.map(page => {
      const customPage: CustomPage = this.translation.language['custom-pages'].find(c => c.page.id === page.id);

      if (!customPage) {
        return page;
      } else {
        customPage.page = page;
        return customPage;
      }
    });
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

    this.translation.is_published = true;
    this.draftService.updateDraft(this.translation)
      .then(() => this.resourcesComponent.loadResources())
      .catch(errors => this.errorMessage = errors[0].detail)
      .then(() => this.publishing = false);
  }

  createPage(): void {
    const modal = this.modalService.open(CreatePageComponent);
    modal.componentInstance.page.resource = this.translation.resource;
    modal.result
      .then(() => this.resourcesComponent.loadResources())
      .catch(console.log);
  }

  createDraft(): void {
    this.saving = true;

    this.draftService.createDraft(this.translation.resource.id, this.translation.language.id)
      .then(() => this.resourcesComponent.loadResources())
      .catch(errors => this.errorMessage = errors[0].detail)
      .then(() => this.saving = false);
  }

  openPage(page: Page): void {
    const modal = this.modalService.open(PageComponent);
    modal.componentInstance.page = page;
    modal.componentInstance.translation = this.translation;
  }

  openCustomPage(page: CustomPage): void {
    this.modalService.open(CustomPageComponent).componentInstance.customPage = page;
  }
}
