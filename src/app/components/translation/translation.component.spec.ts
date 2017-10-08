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

describe('TranslationComponent', () => {
  let comp:    TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;

  let modalServiceStub;

  let resourceComponent: ResourceComponent;
  let language: Language;

  let translation: Translation;

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

    const page1 = buildPage(1);
    const page2 = buildPage(2);

    const r = new Resource();
    r.pages = [ page1, page2 ];
    comp.resourceComponent.resource = r;

    const cp = new CustomPage();
    cp['_type'] = 'custom-page';
    cp.page = page2;

    language = new Language();
    language['custom-pages'] = [ cp ];
    comp.language = language;

    translation = new Translation();
    r.translations = [translation];
    translation.language = language;
    translation.resource = r;
    translation.is_published = false;
    r['latest-drafts-translations'] = [ translation ];

    fixture.detectChanges();
  });

  describe('opening Page/CustomPage editors', () => {
    beforeEach(() => {
      const showPagesButton: DebugElement = fixture.debugElement.query(By.css('.btn.btn-warning'));
      showPagesButton.nativeElement.click();

      fixture.detectChanges();
    });

    it('clicking Page should open PageComponent', () => {
      const pages: DebugElement[] = fixture.debugElement.queryAll(By.css('.btn.btn-outline-dark.btn-block'));
      const page = pages[0];

      page.nativeElement.click();

      expect(modalServiceStub.open).toHaveBeenCalledWith(PageComponent);
    });

    it('clicking CustomPage should open CustomPageComponent', () => {
      const pages: DebugElement[] = fixture.debugElement.queryAll(By.css('.btn.btn-outline-dark.btn-block'));
      const customPage = pages[1];

      customPage.nativeElement.click();

      expect(modalServiceStub.open).toHaveBeenCalledWith(CustomPageComponent);
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
