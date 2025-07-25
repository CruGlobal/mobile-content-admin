import { Component, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageType } from '../../models/message';
import { Resource } from '../../models/resource';
import { Translation } from '../../models/translation';
import { DraftService } from '../../service/draft.service';
import { LanguageService } from '../../service/language.service';
import { ResourceService } from '../../service/resource/resource.service';

enum LanguageTypeEnum {
  draft = 'draft',
  publish = 'publish',
}

interface PromisePayload {
  success: boolean;
  type: LanguageTypeEnum;
  value?: Translation;
  error?: string;
}
interface APICall {
  type: LanguageTypeEnum;
  translation: Translation;
}

type ActionType = 'publish' | 'createDrafts';

@Component({
  selector: 'admin-multiple-draft-generator',
  templateUrl: './multiple-draft-generator.component.html',
  styleUrls: ['./multiple-draft-generator.component.css'],
})
export class MultipleDraftGeneratorComponent implements OnDestroy {
  resource: Resource;
  translations: Translation[];
  actionType: ActionType = 'publish';
  confirmMessage: string;
  errorMessage: string[];
  sucessfulMessages: string[];
  alertMessage: string;
  sucessfulMessage: string;
  checkToEnsureTranslationIsPublished: number;
  disableButtons: boolean;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private draftService: DraftService,
    private resourceService: ResourceService,
    private languageService: LanguageService,
  ) {}

  ngOnDestroy(): void {
    clearInterval(this.checkToEnsureTranslationIsPublished);
  }

  renderMessage(type: MessageType, text: string, time?: number) {
    if (type === MessageType.error) {
      this.errorMessage = [text];
      return;
    } else if (type === MessageType.success) {
      this.sucessfulMessages = [text];
    } else {
      this[`${type}Message`] = text;
      if (time) {
        setTimeout(() => {
          this[`${type}Message`] = '';
        }, time);
      }
    }
  }

  switchActionType(type: ActionType) {
    this.actionType = type;
    this.translations = [];
    this.confirmMessage = '';
    this.sucessfulMessages = [];
    this.alertMessage = '';
    this.disableButtons = false;
    this.resource['latest-drafts-translations'].forEach((translation) => {
      delete translation.selectedForAction;
    });
  }

  showConfirmAlert(): void {
    this.translations = this.resource['latest-drafts-translations'].filter(
      (translation) => translation.selectedForAction,
    );
    if (this.translations.length === 0) {
      return;
    }

    const selectedTranslations = this.translations
      .map((translation) => translation.language.name)
      .join(', ');

    if (this.actionType === 'publish') {
      this.confirmMessage = `Are you sure you want to publish these languages: ${selectedTranslations}?`;
    } else {
      this.confirmMessage = `Are you sure you want to generate a draft for these languages: ${selectedTranslations}?`;
    }
  }

  async publishOrCreateDrafts(): Promise<void> {
    this.confirmMessage = null;
    this.errorMessage = [];
    const promises: APICall[] = [];
    this.disableButtons = true;

    // Define what promises we will call
    this.translations.forEach((translation) => {
      if (this.actionType === 'publish') {
        promises.push({
          type: LanguageTypeEnum.publish,
          translation,
        });
      } else {
        promises.push({
          type: LanguageTypeEnum.draft,
          translation,
        });
      }
    });

    // Call promises
    if (promises.length) {
      if (this.actionType === 'publish') {
        this.renderMessage(MessageType.success, 'Publishing translations...');
      } else {
        this.renderMessage(MessageType.alert, 'Creating drafts...');
      }

      const results: PromisePayload[] = await Promise.all(
        promises.map(({ type, translation }) => {
          if (type === LanguageTypeEnum.draft) {
            return this.draftService
              .createDraft(translation)
              .then(
                () =>
                  ({
                    success: true,
                    type,
                  } as PromisePayload),
              )
              .catch(
                (error) =>
                  ({
                    success: false,
                    type,
                    error,
                  } as PromisePayload),
              );
          } else {
            return this.draftService
              .publishDraft(this.resource, translation)
              .then(
                (value) =>
                  ({
                    success: true,
                    type,
                    value,
                  } as PromisePayload),
              )
              .catch(
                (error) =>
                  ({
                    success: false,
                    type,
                    error,
                  } as PromisePayload),
              );
          }
        }),
      );

      // Determine results
      const invalidResults = results.filter((result) => !result.success);
      if (invalidResults.length) {
        invalidResults.forEach((invalidResult) => {
          this.errorMessage = [...this.errorMessage, invalidResult.error];
        });
        this.disableButtons = false;
      } else {
        if (this.actionType === 'publish') {
          const publishingErrors = results
            .filter((result) => result.value[0]['publishing-errors'])
            .map((result) => result.value[0]['publishing-errors']);
          if (publishingErrors.length) {
            publishingErrors.forEach((publishingError) => {
              this.errorMessage = [...this.errorMessage, publishingError];
            });
          }
          this.checkToEnsureTranslationIsPublished = window.setInterval(() => {
            this.isPublished();
          }, 5000);
        } else {
          this.renderMessage(MessageType.alert, '');
          this.renderMessage(
            MessageType.success,
            'Drafts created. Ready for you to publish.',
          );
          this.disableButtons = false;
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
        }
      }
    }
  }

  isPublished() {
    this.renderMessage(MessageType.success, 'Publishing translations...');
    this.resourceService
      .getResource(this.resource.id, 'latest-drafts-translations')
      .then((resource) => {
        let numberpublished = 0;
        this.translations.forEach((translation) => {
          const updatedTranslation = resource[
            'latest-drafts-translations'
          ].find(
            (draftTranslation) =>
              draftTranslation.language.id === translation.language.id,
          );
          if (updatedTranslation['is-published']) {
            numberpublished++;
            this.sucessfulMessages = [
              ...this.sucessfulMessages,
              `${translation.language.name} version ${updatedTranslation.version} has been published`,
            ];
          }
          if (updatedTranslation['publishing-errors']) {
            clearInterval(this.checkToEnsureTranslationIsPublished);
            this.errorMessage = [
              ...this.errorMessage,
              updatedTranslation['publishing-errors'],
            ];
            this.disableButtons = false;
          }
        });

        if (numberpublished === this.translations.length) {
          clearInterval(this.checkToEnsureTranslationIsPublished);
          this.renderMessage(
            MessageType.success,
            'All Languages are successfully published.',
          );
          this.disableButtons = false;
          this.setResourceAndLoadTranslations(resource);
        }
      })
      .catch((err) => {
        console.log('ERROR', err);
        clearInterval(this.checkToEnsureTranslationIsPublished);
        this.errorMessage = [...this.errorMessage, err];
        this.disableButtons = false;
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
