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

describe('TranslationComponent', () => {
  let comp:    TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;

  let modalServiceStub;

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
  });

  describe('opening Page/CustomPage editors', () => {
    beforeEach(() => {
      const page1 = new Page();
      page1.id = 1;
      page1['_type'] = 'page';

      const page2 = new Page();
      page2.id = 2;
      page2['_type'] = 'page';

      const r = new Resource();
      r.pages = [ page1, page2 ];

      const cp = new CustomPage();
      cp['_type'] = 'custom-page';
      cp.page = page2;

      const l = new Language();
      l['custom-pages'] = [ cp ];

      const t = new Translation();
      r.translations = [t];
      t.language = l;
      t.resource = r;
      t.is_published = false;

      comp.translation = t;

      fixture.detectChanges();

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
    const t = new Translation();

    beforeEach(() => {
      t.language = new Language();
      comp.translation = t;
    });

    it(`should say 'Live' for published translations`, () => {
      t.is_published = true;

      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement.query(By.css('.badge.badge-success'));
      expect(element.nativeElement.textContent).toBe(' | Live');
    });

    it(`should say 'Draft' for drafts`, () => {
      t.is_published = false;

      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement.query(By.css('.badge.badge-secondary'));
      expect(element.nativeElement.textContent).toBe(' | Draft');
    });
  });

  describe('action button', () => {
    const t = new Translation();

    beforeEach(() => {
      t.language = new Language();
      comp.translation = t;
    });

    it(`should say 'New Draft' for published translations`, () => {
      t.is_published = true;

      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement.query(By.css('.btn.btn-secondary'));
      expect(element.nativeElement.textContent.trim()).toBe('New Draft');
    });

    it(`should say 'Publish' for drafts`, () => {
      t.is_published = false;

      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement.query(By.css('.btn.btn-success'));
      expect(element.nativeElement.textContent.trim()).toBe('Publish');
    });
  });
});
