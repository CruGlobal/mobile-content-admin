import { Component, OnDestroy } from '@angular/core';
import { Resource } from '../../models/resource';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DraftService } from '../../service/draft.service';
import { ResourceService } from '../../service/resource/resource.service';
import { LanguageService } from '../../service/language.service';
import { Translation } from '../../models/translation';
import { MessageType } from '../../models/message';

enum LanguageTypeEnum {
  draft = 'draft',
  publish = 'publish',
}

interface PromisePayload {
  success: boolean;
  value?: any;
  error?: string;
  type: LanguageTypeEnum;
}
interface APICall {
  type: LanguageTypeEnum;
  translation: Translation;
}

type LanguagesType = 'published' | 'drafts';

@Component({
  selector: 'admin-multiple-draft-generator',
  templateUrl: './multiple-draft-generator.component.html',
  styleUrls: ['./multiple-draft-generator.component.css'],
})
export class MultipleDraftGeneratorComponent implements OnDestroy {
  resource: Resource;
  translations: Translation[];
  languageType: LanguagesType = 'published';
  confirmMessage: string;
  errorMessage: string[];
  alertMessage: string;
  sucessfulMessage: string;
  checkToEnsureDraftIsPublished: number;

  readonly baseConfirmMessage =
    'Are you sure you want to generate a draft for these languages:';

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private draftService: DraftService,
    private resourceService: ResourceService,
    private languageService: LanguageService,
  ) {}

  ngOnDestroy(): void {
    clearInterval(this.checkToEnsureDraftIsPublished);
  }

  renderMessage(type: MessageType, text: string, time?: number) {
    if (type === MessageType.error) {
      this.errorMessage = [text];
      return;
    }
    this[`${type}Message`] = text;
    if (time) {
      setTimeout(() => {
        this[`${type}Message`] = '';
      }, time);
    }
  }

  showConfirmAlert(): void {
    this.translations = this.resource['latest-drafts-translations'].filter(
      (translation) => translation.generateDraft,
    );
    if (this.translations.length === 0) {
      return;
    }

    const message = this.translations
      .map((translation) => translation.language.name)
      .join(', ');

    this.confirmMessage = `${this.baseConfirmMessage} ${message}?`;
  }

  async publishOrCreateDrafts(): Promise<void> {
    this.confirmMessage = null;
    this.errorMessage = [];
    const promises: APICall[] = [];

    // Define what promises we will call
    this.translations.forEach((translation) => {
      if (translation['is-published'] && this.languageType === 'published') {
        promises.push({
          type: LanguageTypeEnum.draft,
          translation,
        });
      } else if (
        !translation['is-published'] &&
        this.languageType === 'drafts'
      ) {
        promises.push({
          type: LanguageTypeEnum.publish,
          translation,
        });
      }
    });

    // Call promises
    if (promises.length) {
      if (this.languageType === 'published') {
        this.renderMessage(MessageType.alert, 'Creating drafts...');
      } else {
        this.renderMessage(MessageType.success, 'Publishing drafts...');
      }

      const results: PromisePayload[] = await Promise.all(
        promises.map(({ type, translation }) => {
          if (type === LanguageTypeEnum.draft) {
            return this.draftService
              .createDraft(translation)
              .then((value) => ({
                success: true,
                type,
                value,
              }))
              .catch((error) => ({
                success: false,
                type,
                error,
              }));
          } else {
            return this.draftService
              .publishDraft(this.resource, translation)
              .then((value) => ({
                success: true,
                type,
                value,
              }))
              .catch((error) => ({
                success: false,
                type,
                error,
              }));
          }
        }),
      );

      // Determine results
      const invalidResults = results.filter((result) => !result.success);
      if (invalidResults.length) {
        invalidResults.forEach((invalidResult) => {
          this.errorMessage = [...this.errorMessage, invalidResult.error];
        });
      } else {
        if (this.languageType === 'published') {
          this.renderMessage(MessageType.alert, '');
          this.renderMessage(
            MessageType.success,
            'Drafts created. Ready for you to publish.',
          );
          // Update languages
          this.resourceService
            .getResources('latest-drafts-translations')
            .then((resources) => {
              const resource = resources.find((r) => r.id === this.resource.id);
              this.setResourceAndLoadTranslations(resource);
            });
          setTimeout(() => {
            this.renderMessage(MessageType.success, '');
          }, 5000);
        } else {
          const publishingErrors = results.filter(
            (result) => result.value[0]['publishing-errors'],
          );
          if (publishingErrors.length) {
            publishingErrors.forEach((publishingError) => {
              this.errorMessage = [...this.errorMessage, publishingError.error];
            });
          }
          this.checkToEnsureDraftIsPublished = window.setInterval(() => {
            this.isDraftPublished();
          }, 5000);
        }
      }
    }
  }

  isDraftPublished() {
    this.resourceService
      .getResources('latest-drafts-translations')
      .then((resources) => {
        const resource = resources.find((r) => r.id === this.resource.id);
        let numberPubblished = 0;
        this.translations.forEach((translation) => {
          const updatedTranslation = resource[
            'latest-drafts-translations'
          ].find((t) => t.id === translation.id);
          if (updatedTranslation) {
            numberPubblished++;
          }
        });

        if (numberPubblished === this.translations.length) {
          clearInterval(this.checkToEnsureDraftIsPublished);
          this.renderMessage(
            MessageType.success,
            'Drafts are successfully published.',
          );
          this.setResourceAndLoadTranslations(resource);
        }
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
  }

  private setResourceAndLoadTranslations(resource: Resource): void {
    this.resource = resource;
    this.resource['latest-drafts-translations'].forEach((translation) => {
      this.languageService
        .getLanguage(translation.language.id, 'custom_pages,custom_tips')
        .then((language) => {
          translation.language = language;
          translation.is_published = translation['is-published'];
        });
    });
  }

  cancel(): void {
    this.ngbActiveModal.dismiss('dismissed draft generation modal');
  }
}
