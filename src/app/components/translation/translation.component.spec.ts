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

  it('openPage() should open PageComponent', () => {
    comp.openPage(null);

    expect(modalServiceStub.open).toHaveBeenCalledWith(PageComponent);
  });

  it('openCustomPage() should open CustomPageComponent', () => {
    comp.openCustomPage(null);

    expect(modalServiceStub.open).toHaveBeenCalledWith(CustomPageComponent);
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
