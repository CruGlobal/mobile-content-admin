import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslationComponent} from './translation.component';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DraftService} from '../../service/draft.service';
import {PageComponent} from '../page/page.component';
import {CustomPageComponent} from '../custom-page/custom-page.component';
import {Translation} from '../../models/translation';
import {Language} from '../../models/language';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Resource} from '../../models/resource';
import {Page} from '../../models/page';
import {CustomPage} from '../../models/custom-page';
import {ResourceComponent} from '../resource/resource.component';
import anything = jasmine.anything;
import {CustomPageService} from '../../service/custom-page.service';

describe('TranslationComponent', () => {
  let comp:    TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;

  let customPageServiceStub;
  let modalServiceStub;

  let resourceComponent: ResourceComponent;
  let language: Language;

  const buildPage = (id: number): Page => {
    const page = new Page();
    page.id = id;
    page['_type'] = 'page';
    return page;
  };

  beforeEach(async(() => {
    customPageServiceStub = {
      delete() {}
    };

    modalServiceStub = {
      open() {}
    };

    spyOn(customPageServiceStub, 'delete');
    spyOn(modalServiceStub, 'open').and.returnValue({ componentInstance: {} });

    customPageServiceStub.delete();
    modalServiceStub.open();

    TestBed.configureTestingModule({
      declarations: [ TranslationComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        {provide: DraftService},
        {provide: CustomPageService, useValue: customPageServiceStub},
        {provide: NgbModal, useValue: modalServiceStub}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationComponent);
    comp = fixture.componentInstance;

    resourceComponent = new ResourceComponent(null, null);
    comp.resourceComponent = resourceComponent;

    const pageWithCustomPage = buildPage(2);

    const resource = new Resource();
    resource.pages = [ buildPage(1), pageWithCustomPage ];
    comp.resourceComponent.resource = resource;

    const cp = new CustomPage();
    cp['_type'] = 'custom-page';
    cp.page = pageWithCustomPage;

    language = new Language();
    language['custom-pages'] = [ cp ];
    comp.language = language;
  });

  describe('language does not have existing translations', () => {
    beforeEach(() => {
      comp.resourceComponent.resource['latest-drafts-translations'] = [];

      fixture.detectChanges();
    });

    it(`should show action button with 'New Draft'`, () => {
      const element: DebugElement = fixture.debugElement.query(By.css('.btn.btn-secondary'));
      expect(element.nativeElement.textContent.trim()).toBe('New Draft');
    });

    it(`should show status badge with 'None'`, () => {
      const element: DebugElement = fixture.debugElement.query(By.css('.badge.badge-warning'));
      expect(element.nativeElement.textContent).toBe('None');
    });
  });

  describe('language has existing translation(s)', () => {
    let translation: Translation;

    beforeEach(() => {
      translation = new Translation();
      translation.is_published = false;
      translation.language = language;
      translation.resource = comp.resourceComponent.resource;

      comp.resourceComponent.resource.translations = [translation];
      comp.resourceComponent.resource['latest-drafts-translations'] = [ translation ];

      fixture.detectChanges();
    });

    describe('editing Translation page', () => {
      let pages: DebugElement[];

      beforeEach(() => {
        const showPagesButton: DebugElement = fixture.debugElement.query(By.css('.btn.btn-warning'));
        showPagesButton.nativeElement.click();

        fixture.detectChanges();

        pages = fixture.debugElement.queryAll(By.css('tbody tr'));
      });

      describe('with no CustomPage', () => {
        let createButtons: DebugElement[];
        let editButtons: DebugElement[];
        let deleteButtons: DebugElement[];

        beforeEach(() => {
          createButtons = pages[0].queryAll(By.css('button[data-action="create"]'));
          editButtons = pages[0].queryAll(By.css('button[data-action="edit"]'));
          deleteButtons = pages[0].queryAll(By.css('button[data-action="delete"]'));
        });

        it('should have one create button', () => {
          expect(createButtons.length).toEqual(1);
        });

        it('create button should open a CustomPageComponent', () => {
          createButtons[0].nativeElement.click();
          expect(modalServiceStub.open).toHaveBeenCalledWith(CustomPageComponent, anything());
        });

        it('create button should open a large window', () => {
          createButtons[0].nativeElement.click();
          expect(modalServiceStub.open).toHaveBeenCalledWith(anything(), { size: 'lg' });
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
          createButtons = pages[1].queryAll(By.css('button[data-action="create"]'));
          editButtons = pages[1].queryAll(By.css('button[data-action="edit"]'));
          deleteButtons = pages[1].queryAll(By.css('button[data-action="delete"]'));
        });

        it('shouldnt have a create button', () => {
          expect(createButtons.length).toEqual(0);
        });

        it('should have one edit button', () => {
          expect(editButtons.length).toEqual(1);
        });

        it('edit button should open a CustomPageComponent', () => {
          editButtons[0].nativeElement.click();
          expect(modalServiceStub.open).toHaveBeenCalledWith(CustomPageComponent, anything());
        });

        it('edit button should open a large window', () => {
          editButtons[0].nativeElement.click();
          expect(modalServiceStub.open).toHaveBeenCalledWith(anything(), { size: 'lg' });
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

        const element: DebugElement = fixture.debugElement.query(By.css('.badge.badge-success'));
        expect(element.nativeElement.textContent).toBe(' | Live');
      });

      it(`should say 'Draft' for drafts`, () => {
        translation.is_published = false;

        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement.query(By.css('.badge.badge-secondary'));
        expect(element.nativeElement.textContent).toBe(' | Draft');
      });
    });

    describe('action button', () => {
      it(`should say 'New Draft' for published translations`, () => {
        translation.is_published = true;

        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement.query(By.css('.btn.btn-secondary'));
        expect(element.nativeElement.textContent.trim()).toBe('New Draft');
      });

      it(`should say 'Publish' for drafts`, () => {
        translation.is_published = false;

        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement.query(By.css('.btn.btn-success'));
        expect(element.nativeElement.textContent.trim()).toBe('Publish');
      });
    });
  });
});
