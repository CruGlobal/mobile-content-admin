import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbActiveModal, NgbAlert, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MultipleDraftGeneratorComponent} from './multiple-draft-generator.component';
import {FormsModule} from '@angular/forms';
import {DraftService} from '../../service/draft.service';
import {Resource} from '../../models/resource';
import {Translation} from '../../models/translation';
import {By} from '@angular/platform-browser';
import {NgbButtonLabel} from '@ng-bootstrap/ng-bootstrap';
import {Language} from '../../models/language';
import {DebugElement} from '@angular/core';

describe('MultipleDraftGeneratorComponent', () => {
  let comp: MultipleDraftGeneratorComponent;
  let fixture: ComponentFixture<MultipleDraftGeneratorComponent>;

  const buildTranslation = (isPublished: boolean, generateDraft: boolean, language: string) => {
    const l = new Language();
    l.name = language;

    const t = new Translation();
    t.language = l;
    t.is_published = isPublished;
    t.generateDraft = generateDraft;
    return t;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleDraftGeneratorComponent],
      imports: [NgbModule.forRoot(), FormsModule],
      providers: [
        {provide: DraftService},
        {provide: NgbActiveModal}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleDraftGeneratorComponent);
    comp = fixture.componentInstance;

    const translations: Translation[] = [
      buildTranslation(true, false, 'English'),
      buildTranslation(false, false, 'Spanish'),
      buildTranslation(true, true, 'Chinese'),
      buildTranslation(true, true, 'French')
    ];

    const r = new Resource();
    r['latest-drafts-translations'] = translations;
    r.translations = translations;
    comp.resource = r;

    fixture.detectChanges();
  });

  it('only shows languages without drafts', () => {
    expect(fixture.debugElement.queryAll(By.directive(NgbButtonLabel)).length).toBe(3);
  });

  it('confirm message lists all languages', () => {
    comp.showConfirmAlert();
    fixture.detectChanges();

    const alert: DebugElement = fixture.debugElement.query(By.directive(NgbAlert));
    expect(alert.nativeElement.textContent)
      .toContain(`${comp.baseConfirmMessage} Chinese, French?`);
  });
});
