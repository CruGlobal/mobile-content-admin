import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Language } from '../../models/language';
import { Page } from '../../models/page';
import { Resource } from '../../models/resource';
import { Translation } from '../../models/translation';
import { DraftService } from '../../service/draft.service';
import { LanguageService } from '../../service/language.service';
import { PageService } from '../../service/page.service';
import { ResourcesComponent } from '../resources/resources.component';
import { TranslationVersionBadgeComponent } from '../translation/translation-version-badge/translation-version-badge.component';
import { TranslationComponent } from '../translation/translation.component';
import { ResourceComponent } from './resource.component';
import anything = jasmine.anything;

describe('ResourceComponent', () => {
  let comp: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;

  const buildTranslation = (languageId): Translation => {
    const t = new Translation();
    t.language = new Language();
    t.language['_placeHolder'] = true;
    t.language.id = languageId;

    return t;
  };

  const languageServiceStub = ({
    getLanguage() {},
  } as unknown) as LanguageService;
  const languageStub = ({
    _placeHolder: true,
  } as unknown) as Language;
  const pageServiceStub = ({
    update() {},
    reorder() {},
  } as unknown) as PageService;

  const resource: Resource = new Resource();

  const buildPage = (id: number, filename: string, position: number): Page => {
    const page = new Page();
    page.id = id;
    page.filename = filename;
    page.position = position;
    return page;
  };

  beforeEach(
    waitForAsync(() => {
      spyOn(languageServiceStub, 'getLanguage').and.returnValue(
        Promise.resolve(languageStub),
      );
      spyOn(pageServiceStub, 'reorder').and.returnValue(Promise.resolve());
      spyOn(pageServiceStub, 'update').and.returnValue(Promise.resolve(null));

      TestBed.configureTestingModule({
        declarations: [
          ResourcesComponent,
          ResourceComponent,
          TranslationComponent,
          TranslationVersionBadgeComponent,
        ],
        imports: [
          NgbModule,
          FormsModule,
          HttpClientTestingModule,
          DragDropModule,
        ],
        providers: [
          { provide: LanguageService, useValue: languageServiceStub },
          { provide: PageService, useValue: pageServiceStub },
          { provide: NgbModal },
          { provide: DraftService },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceComponent);
    comp = fixture.componentInstance;
    comp.resource = resource;

    comp.resourcesComponent = new ResourcesComponent(
      null,
      null,
      null,
      null,
      null,
    );
  });

  describe('loading languages', () => {
    const languageIdOne = 23;
    const languageIdTwo = 24;

    beforeEach(() => {
      resource['latest-drafts-translations'] = [
        buildTranslation(languageIdOne),
        buildTranslation(languageIdTwo),
      ];
      resource['pages'] = [];
      resource['tips'] = [];
    });

    it('should be done with latest drafts and translations', (done) => {
      comp.ngOnInit();

      setTimeout(() => {
        expect(languageServiceStub.getLanguage).toHaveBeenCalledWith(
          languageIdOne,
          anything(),
        );
        expect(languageServiceStub.getLanguage).toHaveBeenCalledWith(
          languageIdTwo,
          anything(),
        );

        done();
      });
    });

    it('should include custom pages and tips when loading a language', (done) => {
      comp.ngOnInit();

      setTimeout(() => {
        expect(languageServiceStub.getLanguage).toHaveBeenCalledWith(
          anything(),
          'custom_pages,custom_tips',
        );

        done();
      });
    });

    it('if not completed should not show translations', (done) => {
      comp.ngOnInit();

      setTimeout(() => {
        fixture.detectChanges();

        expect(
          fixture.debugElement.queryAll(By.directive(TranslationComponent))
            .length,
        ).toBe(0);

        done();
      });
    });
  });

  describe('page reordering', () => {
    beforeEach(() => {
      resource.id = 13;
      resource['latest-drafts-translations'] = [];
      resource['pages'] = [
        buildPage(2, 'second.xml', 1),
        buildPage(1, 'first.xml', 0),
      ];
      resource['tips'] = [];
      comp.ngOnInit();
    });

    it('sorts pages by position for display', () => {
      expect(comp.pages.map((page) => page.filename)).toEqual([
        'first.xml',
        'second.xml',
      ]);
    });

    it('drop saves the new order and updates positions', (done) => {
      (pageServiceStub.reorder as jasmine.Spy).and.returnValue(
        Promise.resolve(),
      );

      comp.pageErrorMessage = 'stale error';
      comp.onPageDrop({ previousIndex: 0, currentIndex: 1 } as CdkDragDrop<
        Page[]
      >);

      setTimeout(() => {
        expect(pageServiceStub.reorder).toHaveBeenCalledWith(13, [2, 1]);
        expect(comp.pages.map((page) => page.id)).toEqual([2, 1]);
        expect(comp.pages.map((page) => page.position)).toEqual([0, 1]);
        expect(comp.pageErrorMessage).toBeNull();
        expect(comp.resource.pages.map((page) => page.id)).toEqual([2, 1]);
        done();
      });
    });

    it('drop reverts the order when saving fails', (done) => {
      (pageServiceStub.reorder as jasmine.Spy).and.returnValue(
        Promise.reject('the server said no'),
      );

      comp.onPageDrop({ previousIndex: 0, currentIndex: 1 } as CdkDragDrop<
        Page[]
      >);

      setTimeout(() => {
        expect(comp.pages.map((page) => page.id)).toEqual([1, 2]);
        expect(comp.pageErrorMessage).toBe('the server said no');
        done();
      });
    });
  });

  describe('page renaming', () => {
    beforeEach(() => {
      resource.id = 13;
      resource['latest-drafts-translations'] = [];
      resource['pages'] = [
        buildPage(1, 'first.xml', 0),
        buildPage(2, 'second.xml', 1),
      ];
      resource['tips'] = [];
      comp.ngOnInit();
    });

    it('starts renaming with the current filename', () => {
      comp.startRenamePage(comp.pages[0]);

      expect(comp.renamingPage).toBe(comp.pages[0]);
      expect(comp.renameValue).toBe('first.xml');
    });

    it('saves the new filename and closes the editor', (done) => {
      (pageServiceStub.update as jasmine.Spy).and.returnValue(
        Promise.resolve(null),
      );

      comp.startRenamePage(comp.pages[0]);
      comp.renameValue = 'renamed.xml';
      comp.saveRenamePage(comp.pages[0]);

      setTimeout(() => {
        expect(pageServiceStub.update).toHaveBeenCalledWith(1, {
          filename: 'renamed.xml',
        });
        expect(comp.pages[0].filename).toBe('renamed.xml');
        expect(comp.renamingPage).toBeNull();
        done();
      });
    });

    it('keeps the editor open and shows the error when renaming fails', (done) => {
      (pageServiceStub.update as jasmine.Spy).and.returnValue(
        Promise.reject('filename has already been taken'),
      );

      comp.startRenamePage(comp.pages[0]);
      comp.renameValue = 'second.xml';
      comp.saveRenamePage(comp.pages[0]);

      setTimeout(() => {
        expect(comp.pages[0].filename).toBe('first.xml');
        expect(comp.renamingPage).toBe(comp.pages[0]);
        expect(comp.pageErrorMessage).toBe('filename has already been taken');
        done();
      });
    });

    it('cancel closes the editor without saving', () => {
      comp.startRenamePage(comp.pages[0]);

      comp.cancelRenamePage();

      expect(comp.renamingPage).toBeNull();
      expect(pageServiceStub.update).not.toHaveBeenCalled();
    });

    it('does not save a blank filename', () => {
      comp.startRenamePage(comp.pages[0]);
      comp.renameValue = '   ';

      comp.saveRenamePage(comp.pages[0]);

      expect(pageServiceStub.update).not.toHaveBeenCalled();
    });
  });
});
