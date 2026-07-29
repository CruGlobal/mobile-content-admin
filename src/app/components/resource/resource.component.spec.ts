import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Language } from '../../models/language';
import { Page } from '../../models/page';
import { Resource } from '../../models/resource';
import { ResourceType } from '../../models/resource-type';
import { Translation } from '../../models/translation';
import { DraftService } from '../../service/draft.service';
import { LanguageService } from '../../service/language.service';
import { PageService } from '../../service/page.service';
import { ResourceService } from '../../service/resource/resource.service';
import { ResourcesComponent } from '../resources/resources.component';
import { TranslationVersionBadgeComponent } from '../translation/translation-version-badge/translation-version-badge.component';
import { TranslationComponent } from '../translation/translation.component';
import { ResourceComponent } from './resource.component';
import anything = jasmine.anything;

describe('ResourceComponent', () => {
  let comp: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;

  const languageIdOne = 23;
  const languageIdTwo = 24;
  const DETAIL_INCLUDES =
    'latest-drafts-translations,pages,custom-manifests,tips,attachments,variants';

  const buildTranslation = (languageId): Translation => {
    const t = new Translation();
    t.language = new Language();
    t.language['_placeHolder'] = true;
    t.language.id = languageId;
    return t;
  };

  const buildDetailResource = (): Resource => {
    const r = new Resource();
    r.id = 5;
    r['latest-drafts-translations'] = [
      buildTranslation(languageIdOne),
      buildTranslation(languageIdTwo),
    ];
    r.pages = [];
    r.tips = [];
    return r;
  };

  const buildListResource = (typeName = 'tract'): Resource => {
    const r = new Resource();
    r.id = 5;
    r.name = 'Test Tool';
    r.resourceType = ({
      id: typeName === 'metatool' ? 9 : 1,
      name: typeName,
    } as unknown) as ResourceType;
    return r;
  };

  // Expands the card and runs `then` once the details have loaded and the
  // deferred expand animation frame has run.
  const expandAndLoad = (then: () => void): void => {
    comp.toggleDetails();
    setTimeout(() =>
      requestAnimationFrame(() => {
        expect(comp.showDetails).toBe(true);
        then();
      }),
    );
  };

  const replaceResource = (replacement: Resource): Resource => {
    const previous = comp.resource;
    comp.resource = replacement;
    comp.ngOnChanges({
      resource: new SimpleChange(previous, replacement, false),
    });
    return previous;
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

  const resourceServiceStub = ({
    getResource() {},
  } as unknown) as ResourceService;
  let resource: Resource;

  const buildPage = (id: number, filename: string, position: number): Page => {
    const page = new Page();
    page.id = id;
    page.filename = filename;
    page.position = position;
    return page;
  };

  // Pages arrive with the lazily-loaded details, so page tests stub the detail
  // response rather than assigning to the list resource.
  const setDetailPages = (pages: Page[]): void => {
    (resourceServiceStub.getResource as jasmine.Spy).and.callFake(() => {
      const detail = new Resource();
      detail.id = 13;
      detail['latest-drafts-translations'] = [];
      detail.pages = pages;
      detail.tips = [];
      return Promise.resolve(detail);
    });
  };

  beforeEach(
    waitForAsync(() => {
      spyOn(languageServiceStub, 'getLanguage').and.returnValue(
        Promise.resolve(languageStub),
      );
      spyOn(pageServiceStub, 'reorder').and.returnValue(Promise.resolve());
      spyOn(pageServiceStub, 'update').and.returnValue(Promise.resolve(null));
      spyOn(resourceServiceStub, 'getResource').and.callFake(() =>
        Promise.resolve(buildDetailResource()),
      );

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
          { provide: ResourceService, useValue: resourceServiceStub },
          { provide: NgbModal },
          { provide: DraftService },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceComponent);
    comp = fixture.componentInstance;
    resource = buildListResource();
    comp.resource = resource;

    comp.resourcesComponent = new ResourcesComponent(
      null,
      null,
      null,
      null,
      null,
    );
  });

  it('should not load any detail data on init', (done) => {
    setTimeout(() => {
      expect(resourceServiceStub.getResource).not.toHaveBeenCalled();
      expect(languageServiceStub.getLanguage).not.toHaveBeenCalled();
      expect(comp.detailsLoaded).toBe(false);
      done();
    });
  });

  it('should load details and translations on first expand', (done) => {
    comp.toggleDetails();

    setTimeout(() => {
      expect(resourceServiceStub.getResource).toHaveBeenCalledWith(
        5,
        DETAIL_INCLUDES,
      );
      expect(languageServiceStub.getLanguage).toHaveBeenCalledWith(
        languageIdOne,
        'custom_pages,custom_tips',
      );
      expect(languageServiceStub.getLanguage).toHaveBeenCalledWith(
        languageIdTwo,
        anything(),
      );
      expect(comp.detailsLoaded).toBe(true);
      done();
    });
  });

  it('should not refetch details when collapsing and re-expanding', (done) => {
    comp.toggleDetails(); // open + load

    setTimeout(() => {
      comp.toggleDetails(); // collapse
      comp.toggleDetails(); // re-open

      setTimeout(() => {
        expect(resourceServiceStub.getResource).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('page reordering', () => {
    beforeEach((done) => {
      resource.id = 13;
      setDetailPages([
        buildPage(2, 'second.xml', 1),
        buildPage(1, 'first.xml', 0),
        buildPage(3, 'third.xml', 2),
      ]);
      comp.loadDetails().then(() => done());
    });

    it('sorts pages by position for display', () => {
      expect(comp.pages.map((page) => page.filename)).toEqual([
        'first.xml',
        'second.xml',
        'third.xml',
      ]);
    });

    it('drop saves the new order and updates positions', (done) => {
      (pageServiceStub.reorder as jasmine.Spy).and.returnValue(
        Promise.resolve(),
      );

      comp.pageErrorMessage = 'stale error';
      comp.onPageDrop({ previousIndex: 0, currentIndex: 2 } as CdkDragDrop<
        Page[]
      >);

      setTimeout(() => {
        expect(pageServiceStub.reorder).toHaveBeenCalledWith(13, [2, 3, 1]);
        expect(comp.pages.map((page) => page.id)).toEqual([2, 3, 1]);
        expect(comp.pages.map((page) => page.position)).toEqual([0, 1, 2]);
        expect(comp.pageErrorMessage).toBeNull();
        expect(comp.resource.pages.map((page) => page.id)).toEqual([2, 3, 1]);
        done();
      });
    });

    it('drop reverts the order when saving fails', (done) => {
      (pageServiceStub.reorder as jasmine.Spy).and.returnValue(
        Promise.reject('the server said no'),
      );

      comp.onPageDrop({ previousIndex: 0, currentIndex: 2 } as CdkDragDrop<
        Page[]
      >);

      setTimeout(() => {
        expect(comp.pages.map((page) => page.id)).toEqual([1, 2, 3]);
        expect(comp.resource.pages.map((page) => page.id)).toEqual([2, 1, 3]);
        expect(comp.pageErrorMessage).toBe('the server said no');
        done();
      });
    });
  });

  describe('page renaming', () => {
    beforeEach((done) => {
      resource.id = 13;
      setDetailPages([
        buildPage(1, 'first.xml', 0),
        buildPage(2, 'second.xml', 1),
      ]);
      comp.loadDetails().then(() => done());
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

    it('does not save when the filename is unchanged', () => {
      comp.startRenamePage(comp.pages[0]);

      comp.saveRenamePage(comp.pages[0]);

      expect(pageServiceStub.update).not.toHaveBeenCalled();
      expect(comp.renamingPage).toBeNull();
    });

    it('keeps the rename editor anchored when the details reload', (done) => {
      comp.startRenamePage(comp.pages[0]);
      comp.renameValue = 'draft-name.xml';

      setDetailPages([
        buildPage(1, 'first.xml', 0),
        buildPage(2, 'second.xml', 1),
      ]);
      comp.reloadDetails().then(() => {
        expect(comp.renamingPage).toBe(comp.pages[0]);
        expect(comp.renameValue).toBe('draft-name.xml');
        done();
      });
    });

    it('cancels the rename when the page no longer exists after a reload', (done) => {
      comp.startRenamePage(comp.pages[0]);

      setDetailPages([buildPage(2, 'second.xml', 1)]);
      comp.reloadDetails().then(() => {
        expect(comp.renamingPage).toBeNull();
        done();
      });
    });
  });

  describe('saving gate', () => {
    beforeEach((done) => {
      resource.id = 13;
      setDetailPages([
        buildPage(1, 'first.xml', 0),
        buildPage(2, 'second.xml', 1),
      ]);
      comp.loadDetails().then(() => done());
    });

    it('ignores a second drop while a reorder is in flight', () => {
      comp.onPageDrop({ previousIndex: 0, currentIndex: 1 } as CdkDragDrop<
        Page[]
      >);

      expect(comp.saving).toBe(true);

      comp.onPageDrop({ previousIndex: 1, currentIndex: 0 } as CdkDragDrop<
        Page[]
      >);

      expect(pageServiceStub.reorder).toHaveBeenCalledTimes(1);
    });

    it('resets saving after success and after failure', (done) => {
      comp.onPageDrop({ previousIndex: 0, currentIndex: 1 } as CdkDragDrop<
        Page[]
      >);

      setTimeout(() => {
        expect(comp.saving).toBe(false);

        (pageServiceStub.reorder as jasmine.Spy).and.returnValue(
          Promise.reject('the server said no'),
        );
        comp.onPageDrop({ previousIndex: 0, currentIndex: 1 } as CdkDragDrop<
          Page[]
        >);
        expect(comp.saving).toBe(true);

        setTimeout(() => {
          expect(comp.saving).toBe(false);
          done();
        });
      });
    });
  });

  it('should refetch details on reloadDetails', (done) => {
    comp.toggleDetails();

    setTimeout(() => {
      comp.reloadDetails();

      setTimeout(() => {
        expect(resourceServiceStub.getResource).toHaveBeenCalledTimes(2);
        expect(comp.detailsLoaded).toBe(true);
        done();
      });
    });
  });

  it('should not expand metatools', (done) => {
    resource.resourceType = ({
      id: 9,
      name: 'metatool',
    } as unknown) as ResourceType;
    comp.toggleDetails();

    setTimeout(() => {
      expect(comp.showDetails).toBe(false);
      expect(resourceServiceStub.getResource).not.toHaveBeenCalled();
      done();
    });
  });

  it('should render the loading indicator while details load', () => {
    comp.loadingDetails = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-spinner')).toBeTruthy();
  });

  it('should not render the detail body before details are loaded', () => {
    comp.showDetails = true;
    comp.detailsLoaded = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Default Pages');
  });

  it('should render pages/tips/languages once details are loaded', (done) => {
    comp.toggleDetails();
    setTimeout(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Default Pages');
      expect(fixture.nativeElement.textContent).toContain(
        'Customize Languages',
      );
      done();
    });
  });

  it('should preload details before opening the Bulk Actions modal for an unexpanded tool', (done) => {
    const modalService = TestBed.inject(NgbModal);
    const openSpy = spyOn(modalService, 'open').and.returnValue(({
      componentInstance: {},
      result: Promise.resolve(),
    } as unknown) as NgbModalRef);

    comp.openGenerateModal(comp.resource);

    setTimeout(() => {
      expect(resourceServiceStub.getResource).toHaveBeenCalledWith(
        5,
        DETAIL_INCLUDES,
      );
      expect(openSpy).toHaveBeenCalled();
      done();
    });
  });

  it('should preload details before opening the Details modal', (done) => {
    const modalService = TestBed.inject(NgbModal);
    const openSpy = spyOn(modalService, 'open').and.returnValue(({
      componentInstance: {},
      result: Promise.resolve(),
    } as unknown) as NgbModalRef);
    spyOn(comp.resourcesComponent, 'loadResources');

    comp.openUpdateModal(comp.resource);

    setTimeout(() => {
      expect(resourceServiceStub.getResource).toHaveBeenCalledWith(
        5,
        DETAIL_INCLUDES,
      );
      expect(openSpy).toHaveBeenCalled();
      done();
    });
  });

  it('should not refetch details for the modal when already loaded', (done) => {
    comp.detailsLoaded = true;
    const modalService = TestBed.inject(NgbModal);
    spyOn(modalService, 'open').and.returnValue(({
      componentInstance: {},
      result: Promise.resolve(),
    } as unknown) as NgbModalRef);
    spyOn(comp.resourcesComponent, 'loadResources');

    comp.openUpdateModal(comp.resource);

    setTimeout(() => {
      expect(resourceServiceStub.getResource).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not mark details as loaded until the translation languages are hydrated', (done) => {
    let resolveLanguage;
    (languageServiceStub.getLanguage as jasmine.Spy).and.returnValue(
      new Promise((resolve) => (resolveLanguage = resolve)),
    );

    comp.toggleDetails();

    setTimeout(() => {
      expect(resourceServiceStub.getResource).toHaveBeenCalled();
      expect(comp.detailsLoaded).toBe(false);

      resolveLanguage(languageStub);

      setTimeout(() => {
        expect(comp.detailsLoaded).toBe(true);
        expect(comp.resource['latest-drafts-translations'][0].language).toBe(
          languageStub,
        );
        done();
      });
    });
  });

  it('should not open a modal when the detail load fails', (done) => {
    (resourceServiceStub.getResource as jasmine.Spy).and.returnValue(
      Promise.reject('Details unavailable'),
    );
    const modalService = TestBed.inject(NgbModal);
    const openSpy = spyOn(modalService, 'open');

    comp.openGenerateModal(comp.resource);

    setTimeout(() => {
      expect(openSpy).not.toHaveBeenCalled();
      expect(comp.detailsLoaded).toBe(false);
      expect(comp.errorMessage).toBe('Details unavailable');
      done();
    });
  });

  it('should open the panel to show the error when the detail load fails', (done) => {
    (resourceServiceStub.getResource as jasmine.Spy).and.returnValue(
      Promise.reject('Details unavailable'),
    );

    comp.toggleDetails();

    setTimeout(() => {
      expect(comp.showDetails).toBe(true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.card-body ngb-alert').textContent,
      ).toContain('Details unavailable');
      done();
    });
  });

  it('should keep the expanded body rendered while reloading a replaced resource', (done) => {
    expandAndLoad(() => {
      (resourceServiceStub.getResource as jasmine.Spy).calls.reset();
      const previous = replaceResource(buildListResource());

      expect(comp.detailsLoaded).toBe(true);
      expect(comp.resource.pages).toBe(previous.pages);
      expect(comp.resource['latest-drafts-translations']).toBe(
        previous['latest-drafts-translations'],
      );
      expect(resourceServiceStub.getResource).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should drop the details of a collapsed resource without refetching', (done) => {
    expandAndLoad(() => {
      comp.toggleDetails(); // collapse
      (resourceServiceStub.getResource as jasmine.Spy).calls.reset();

      replaceResource(buildListResource());

      expect(comp.detailsLoaded).toBe(false);
      expect(resourceServiceStub.getResource).not.toHaveBeenCalled();
      done();
    });
  });

  it('should collapse a resource that becomes a metatool', (done) => {
    expandAndLoad(() => {
      replaceResource(buildListResource('metatool'));

      expect(comp.showDetails).toBe(false);
      expect(comp.detailsLoaded).toBe(false);
      done();
    });
  });
});
