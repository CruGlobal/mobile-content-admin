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

describe('TranslationComponent', () => {
  let comp:    TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;

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
    modalServiceStub = {
      open() {}
    };

    spyOn(modalServiceStub, 'open').and.returnValue({ componentInstance: {} });

    modalServiceStub.open();

    TestBed.configureTestingModule({
      declarations: [ TranslationComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        {provide: DraftService},
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

    describe('opening Page/CustomPage editors', () => {
      let pages: DebugElement[];

      beforeEach(() => {
        const showPagesButton: DebugElement = fixture.debugElement.query(By.css('.btn.btn-warning'));
        showPagesButton.nativeElement.click();

        fixture.detectChanges();

        pages = fixture.debugElement.queryAll(By.css('.btn.btn-outline-dark.btn-block'));
      });

      describe('clicking Page', () => {
        beforeEach(() => {
          pages[0].nativeElement.click();
        });

        it('should open PageComponent', () => {
          expect(modalServiceStub.open).toHaveBeenCalledWith(PageComponent, anything());
        });

        it('should open a large window', () => {
          expect(modalServiceStub.open).toHaveBeenCalledWith(anything(), { size: 'lg' });
        });
      });

      describe('clicking CustomPage', () => {
        beforeEach(() => {
          pages[1].nativeElement.click();
        });

        it('clicking CustomPage should open CustomPageComponent', () => {
          expect(modalServiceStub.open).toHaveBeenCalledWith(CustomPageComponent, anything());
        });

        it('should open a large window', () => {
          expect(modalServiceStub.open).toHaveBeenCalledWith(anything(), { size: 'lg' });
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
