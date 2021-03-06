import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { CustomPageService } from '../../service/custom-page.service';
import { CustomManifestService } from '../../service/custom-manifest.service';
import { CustomManifest } from '../../models/custom-manifest';
import { CustomTipService } from '../../service/custom-tip.service';
import { TranslationVersionBadgeComponent } from './translation-version-badge/translation-version-badge.component';

describe('TranslationComponent', () => {
  let comp: TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;

  let customPageServiceStub;
  let customTipsServiceStub;
  let modalServiceStub;
  let customManifestServiceStub;

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

  beforeEach(async(() => {
    customPageServiceStub = {
      delete() {},
    };
    customTipsServiceStub = {};

    modalServiceStub = {
      open() {},
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

    customPageServiceStub.delete();
    modalServiceStub.open();
    customManifestServiceStub.delete();

    TestBed.configureTestingModule({
      declarations: [TranslationComponent, TranslationVersionBadgeComponent],
      imports: [NgbModule.forRoot()],
      providers: [
        { provide: DraftService },
        { provide: CustomPageService, useValue: customPageServiceStub },
        { provide: CustomTipService, useValue: customTipsServiceStub },
        { provide: CustomManifestService, useValue: customManifestServiceStub },
        { provide: NgbModal, useValue: modalServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationComponent);
    comp = fixture.componentInstance;

    resourceComponent = new ResourceComponent(null, null);
    comp.translationLoaded = resourceComponent.translationLoaded$;

    const pageWithCustomPage = buildPage(2);

    const cp = new CustomPage();
    cp['_type'] = 'custom-page';
    cp.page = pageWithCustomPage;

    language = new Language();
    language['custom-pages'] = [cp];
    language.id = 1;
    comp.language = language;

    const resource = new Resource();
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

    it(`should show action button with 'New Draft'`, () => {
      const element: DebugElement = fixture.debugElement
        .queryAll(By.css('.btn.btn-secondary'))
        .pop();
      expect(element.nativeElement.textContent.trim()).toBe('New Draft');
    });

    it(`should show status badge with 'None'`, () => {
      const element: DebugElement = fixture.debugElement.query(
        By.css('.badge.badge-warning'),
      );
      expect(element.nativeElement.textContent).toBe('None');
    });
  });

  describe('language has existing translation(s)', () => {
    let translation: Translation;

    beforeEach(() => {
      translation = new Translation();
      translation.is_published = false;
      translation.language = language;
      translation.resource = comp.resource;

      comp.resource.translations = [translation];
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
      it(`should say 'New Draft' for published translations`, () => {
        translation.is_published = true;

        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement
          .queryAll(By.css('.btn.btn-secondary'))
          .pop();
        expect(element.nativeElement.textContent.trim()).toBe('New Draft');
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
