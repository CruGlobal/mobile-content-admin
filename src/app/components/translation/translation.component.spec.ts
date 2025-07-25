import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslationComponent } from './translation.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DraftService } from '../../service/draft.service';
import { CustomPageComponent } from '../custom-page/custom-page.component';
import { Translation } from '../../models/translation';
import { Language } from '../../models/language';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Resource } from '../../models/resource';
import { Page } from '../../models/page';
import { CustomPage } from '../../models/custom-page';
import { ResourceComponent } from '../resource/resource.component';
import anything = jasmine.anything;
import { ResourceService } from '../../service/resource/resource.service';
import { CustomPageService } from '../../service/custom-page.service';
import { CustomManifestService } from '../../service/custom-manifest.service';
import { CustomTipService } from '../../service/custom-tip.service';
import { CustomManifest } from '../../models/custom-manifest';
import { MessageType } from '../../models/message';
import { TranslationVersionBadgeComponent } from './translation-version-badge/translation-version-badge.component';

describe('TranslationComponent', () => {
  let comp: TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;

  let customPageServiceStub;
  let customTipsServiceStub;
  let modalServiceStub;
  let customManifestServiceStub;
  let customDraftServiceStub;
  let customResourceServiceStub;

  let resourceComponent: ResourceComponent;
  let language: Language;

  const buildPage = (id: number): Page => {
    const page = new Page();
    page.id = id;
    page['_type'] = 'page';
    return page;
  };

  const buildCustomManifest = (
    id: number,
    lang: Language,
    resource: Resource,
  ): CustomManifest => {
    const manifest = new CustomManifest();
    manifest.id = id;
    manifest['_type'] = 'custom-manifest';
    manifest.language = lang;
    manifest.resource = resource;
    manifest.structure =
      '<manifest xmlns="https://mobile-content-api.cru.org/xmlns/manifest"></manifest>';
    return manifest;
  };

  const getPageCreateButtons = (page: DebugElement): DebugElement[] => {
    return page.queryAll(By.css('button[data-action="create"]'));
  };

  const getPageEditButtons = (page: DebugElement): DebugElement[] => {
    return page.queryAll(By.css('button[data-action="edit"]'));
  };

  const getPageDeleteButtons = (page: DebugElement): DebugElement[] => {
    return page.queryAll(By.css('button[data-action="delete"]'));
  };

  beforeEach(
    waitForAsync(() => {
      customPageServiceStub = {
        delete() {},
      };
      customTipsServiceStub = {};

      modalServiceStub = {
        open() {},
      };
      customDraftServiceStub = {
        publishDraft() {},
      };
      customResourceServiceStub = {
        getResource() {},
      };
      const modalRef = {
        componentInstance: {},
        result: Promise.resolve(),
      };

      customManifestServiceStub = {
        delete() {},
      };

      spyOn(customPageServiceStub, 'delete').and.returnValue(Promise.resolve());
      spyOn(modalServiceStub, 'open').and.returnValue(modalRef);
      spyOn(customManifestServiceStub, 'delete').and.returnValue(
        Promise.resolve(),
      );
      spyOn(customDraftServiceStub, 'publishDraft').and.returnValue(
        Promise.resolve([
          {
            'publishing-errors': null,
          },
        ]),
      );
      spyOn(customResourceServiceStub, 'getResource').and.returnValue(
        Promise.resolve({
          'latest-drafts-translations': [
            {
              language: { id: 1 },
              'publishing-errors': null,
              'is-published': false,
            },
          ],
        }),
      );

      customPageServiceStub.delete();
      modalServiceStub.open();
      customManifestServiceStub.delete();
      customDraftServiceStub.publishDraft();
      customResourceServiceStub.getResource();

      TestBed.configureTestingModule({
        declarations: [TranslationComponent, TranslationVersionBadgeComponent],
        imports: [NgbModule, HttpClientTestingModule],
        providers: [
          { provide: DraftService, useValue: customDraftServiceStub },
          { provide: CustomPageService, useValue: customPageServiceStub },
          { provide: CustomTipService, useValue: customTipsServiceStub },
          {
            provide: CustomManifestService,
            useValue: customManifestServiceStub,
          },
          { provide: NgbModal, useValue: modalServiceStub },
          { provide: ResourceService, useValue: customResourceServiceStub },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationComponent);
    comp = fixture.componentInstance;

    resourceComponent = new ResourceComponent(null, null);
    comp.translationLoaded = resourceComponent.translationLoaded$;
    comp.errorMessage = '';
    comp.alertMessage = '';
    comp.sucessfulMessage = '';

    const pageWithCustomPage = buildPage(2);

    const cp = new CustomPage();
    cp['_type'] = 'custom-page';
    cp.page = pageWithCustomPage;

    language = new Language();
    language['custom-pages'] = [cp];
    language.id = 1;
    comp.language = language;

    const resource = new Resource();
    resource.id = 15;
    resource.pages = [buildPage(1), pageWithCustomPage];
    resource.tips = [];
    resource['custom-manifests'] = [
      buildCustomManifest(12, language, resource),
    ];
    comp.resource = resource;
  });

  describe('language does not have existing translations', () => {
    beforeEach(() => {
      comp.resource['latest-drafts-translations'] = [];
      comp.reloadTranslation();
      fixture.detectChanges();
    });

    it(`should show action button with 'Publish'`, () => {
      const element: DebugElement = fixture.debugElement
        .queryAll(By.css('.btn.btn-success'))
        .pop();
      expect(element.nativeElement.textContent.trim()).toBe('Publish');
    });

    it(`should show status badge with 'None'`, () => {
      const element: DebugElement = fixture.debugElement.query(
        By.css('.badge.badge-warning'),
      );
      expect(element.nativeElement.textContent).toBe('None');
    });

    describe('publish a new translation (Server creates draft)', () => {
      let translation: Translation;

      beforeEach(() => {
        translation = new Translation();
        translation.none = true;
        translation.language = language;
        translation.resource = comp.resource;

        comp.resource['latest-drafts-translations'] = [translation];
        comp.reloadTranslation();
        fixture.detectChanges();
      });

      it('should git resource endpoint', fakeAsync(() => {
        spyOn(comp, 'renderMessage');
        spyOn(comp, 'isPublished');
        comp.publish();

        expect(comp.renderMessage).toHaveBeenCalledWith(MessageType.error, '');
        expect(comp.renderMessage).toHaveBeenCalledWith(
          MessageType.success,
          'Publishing...',
        );

        tick(5500);
        fixture.detectChanges();

        discardPeriodicTasks();
        fixture.whenStable().then(() => {
          expect(comp.isPublished).toHaveBeenCalled();
        });
      }));

      it('should clear the interval on destroy', fakeAsync(() => {
        spyOn(comp, 'renderMessage');
        spyOn(comp, 'isPublished');
        spyOn(window, 'clearInterval');
        comp.publish();
        tick(5500);
        fixture.detectChanges();
        discardPeriodicTasks();

        comp.ngOnDestroy();
        fixture.whenStable().then(() => {
          expect(window.clearInterval).toHaveBeenCalled();
        });
      }));
    });
  });

  describe('isPublished()', () => {
    let translation: Translation;

    beforeEach(() => {
      translation = new Translation();
      translation.language = language;
      translation.none = true;
      translation.resource = comp.resource;
      comp.translation = translation;
      comp.resource['latest-drafts-translations'] = [translation];
      comp.reloadTranslation();
      fixture.detectChanges();
    });

    it('should not run clearInterval as it is not published and had no errors', () => {
      spyOn(window, 'clearInterval');
      comp.isPublished();

      expect(customResourceServiceStub.getResource).toHaveBeenCalledWith(
        15,
        'latest-drafts-translations',
      );
      expect(window.clearInterval).not.toHaveBeenCalled();
    });

    it('should run clearInterval and report pubslishing error to user', fakeAsync(() => {
      customResourceServiceStub.getResource.and.returnValue(
        Promise.resolve({
          'latest-drafts-translations': [
            {
              language: { id: 1 },
              'publishing-errors': 'Error while saving',
              'is-published': false,
            },
          ],
        }),
      );
      spyOn(window, 'clearInterval');
      spyOn(comp, 'renderMessage');
      comp.isPublished();

      tick();
      fixture.detectChanges();

      expect(window.clearInterval).toHaveBeenCalled();
      expect(comp.renderMessage).toHaveBeenCalledWith(
        MessageType.success,
        null,
      );
      expect(comp.renderMessage).toHaveBeenCalledWith(
        MessageType.error,
        'Error while saving',
      );
    }));

    it('should run clearInterval and report success to user', fakeAsync(() => {
      customResourceServiceStub.getResource.and.returnValue(
        Promise.resolve({
          'latest-drafts-translations': [
            {
              language: { id: 1 },
              'publishing-errors': null,
              'is-published': true,
            },
          ],
        }),
      );
      spyOn(window, 'clearInterval');
      spyOn(comp, 'renderMessage');
      comp.isPublished();

      tick();
      fixture.detectChanges();

      expect(window.clearInterval).toHaveBeenCalled();
      expect(comp.renderMessage).toHaveBeenCalledWith(
        MessageType.error,
        null,
      );
      expect(comp.renderMessage).toHaveBeenCalledWith(
        MessageType.success,
        comp.successfullyPublishedMessage,
      );
    }));
  });

  describe('language has existing translation(s)', () => {
    let translation: Translation;

    beforeEach(() => {
      translation = new Translation();
      translation.is_published = false;
      translation.language = language;
      translation.resource = comp.resource;

      comp.resource['latest-drafts-translations'] = [translation];
      comp.reloadTranslation();
      fixture.detectChanges();
    });

    describe('editing Translation page', () => {
      let pages: DebugElement[];

      beforeEach(() => {
        pages = fixture.debugElement.queryAll(
          By.css('.list-group .list-group-item'),
        );
      });

      describe('with no CustomPage', () => {
        let createButtons: DebugElement[];
        let editButtons: DebugElement[];
        let deleteButtons: DebugElement[];

        beforeEach(() => {
          createButtons = getPageCreateButtons(pages[0]);
          editButtons = getPageEditButtons(pages[0]);
          deleteButtons = getPageDeleteButtons(pages[0]);
        });

        it('should have one create button', () => {
          expect(createButtons.length).toEqual(1);
        });

        it('create button should open a CustomPageComponent', () => {
          createButtons[0].nativeElement.click();
          expect(modalServiceStub.open).toHaveBeenCalledWith(
            CustomPageComponent,
            anything(),
          );
        });

        it('create button should open a large window', () => {
          createButtons[0].nativeElement.click();
          expect(modalServiceStub.open).toHaveBeenCalledWith(anything(), {
            size: 'lg',
          });
        });

        it('shouldnt have any edit buttons', () => {
          expect(editButtons.length).toEqual(0);
        });

        it('shouldnt have a delete button', () => {
          expect(deleteButtons.length).toEqual(0);
        });
      });

      describe('with a CustomPage', () => {
        let createButtons: DebugElement[];
        let editButtons: DebugElement[];
        let deleteButtons: DebugElement[];

        beforeEach(() => {
          createButtons = getPageCreateButtons(pages[1]);
          editButtons = getPageEditButtons(pages[1]);
          deleteButtons = getPageDeleteButtons(pages[1]);
        });

        it('shouldnt have a create button', () => {
          expect(createButtons.length).toEqual(0);
        });

        it('should have one edit button', () => {
          expect(editButtons.length).toEqual(1);
        });

        it('edit button should open a CustomPageComponent', () => {
          editButtons[0].nativeElement.click();
          expect(modalServiceStub.open).toHaveBeenCalledWith(
            CustomPageComponent,
            anything(),
          );
        });

        it('edit button should open a large window', () => {
          editButtons[0].nativeElement.click();
          expect(modalServiceStub.open).toHaveBeenCalledWith(anything(), {
            size: 'lg',
          });
        });

        it('should have one delete button', () => {
          expect(deleteButtons.length).toEqual(1);
        });

        it('delete button should delete the custom page', () => {
          deleteButtons[0].nativeElement.click();
          expect(customPageServiceStub.delete).toHaveBeenCalled();
        });
      });
    });

    describe('status badge', () => {
      it(`should say 'Live' for published translations`, () => {
        translation.is_published = true;

        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement.query(
          By.css('.badge.badge-success'),
        );
        expect(element.nativeElement.textContent).toBe(' | Live');
      });

      it(`should say 'Draft' for drafts`, () => {
        translation.is_published = false;

        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement.query(
          By.css('.badge.badge-secondary'),
        );
        expect(element.nativeElement.textContent).toBe(' | Draft');
      });
    });

    describe('action button', () => {
      it(`should say 'Publish' for published translations`, () => {
        translation.is_published = true;

        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement
          .queryAll(By.css('.btn.btn-success'))
          .pop();
        expect(element.nativeElement.textContent.trim()).toBe('Publish');
      });

      it(`should say 'Publish' for drafts`, () => {
        translation.is_published = false;

        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement.query(
          By.css('.btn.btn-success'),
        );
        expect(element.nativeElement.textContent.trim()).toBe('Publish');
      });
    });
  });
});
