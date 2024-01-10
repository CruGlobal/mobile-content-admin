import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NgbActiveModal,
  NgbAlert,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MultipleDraftGeneratorComponent } from './multiple-draft-generator.component';
import { FormsModule } from '@angular/forms';
import { DraftService } from '../../service/draft.service';
import { LanguageService } from '../../service/language.service';
import { ResourceService } from '../../service/resource/resource.service';
import { Resource } from '../../models/resource';
import { Translation } from '../../models/translation';
import { By } from '@angular/platform-browser';
import { NgbButtonLabel } from '@ng-bootstrap/ng-bootstrap';
import { Language } from '../../models/language';
import { DebugElement } from '@angular/core';
import { TranslationVersionBadgeComponent } from '../translation/translation-version-badge/translation-version-badge.component';
import { MessageType } from '../../models/message';

describe('MultipleDraftGeneratorComponent', () => {
  let comp: MultipleDraftGeneratorComponent;
  let fixture: ComponentFixture<MultipleDraftGeneratorComponent>;

  const buildTranslation = (
    isPublished: boolean,
    selectedForAction: boolean,
    language: string,
  ) => {
    const l = new Language();
    l.name = language;

    const t = new Translation();
    t.language = l;
    t.is_published = isPublished;
    t['is-published'] = isPublished;
    t.selectedForAction = selectedForAction;
    return t;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MultipleDraftGeneratorComponent,
        TranslationVersionBadgeComponent,
      ],
      imports: [NgbModule.forRoot(), FormsModule],
      providers: [
        { provide: DraftService },
        { provide: NgbActiveModal },
        { provide: ResourceService },
        { provide: LanguageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleDraftGeneratorComponent);
    comp = fixture.componentInstance;

    const translations: Translation[] = [
      buildTranslation(true, false, 'English'),
      buildTranslation(false, false, 'Spanish'),
      buildTranslation(true, true, 'Chinese'),
      buildTranslation(true, true, 'French'),
    ];

    const r = new Resource();
    r['latest-drafts-translations'] = translations;
    comp.resource = r;
    comp.actionType = 'publish';

    fixture.detectChanges();
  });

  it('shows languages with and without drafts', () => {
    expect(
      fixture.debugElement.queryAll(By.directive(NgbButtonLabel)).length,
    ).toBe(4);
  });

  it('shows confirm message to publish selected languages', () => {
    comp.showConfirmAlert();
    fixture.detectChanges();

    const alert: DebugElement = fixture.debugElement.query(
      By.directive(NgbAlert),
    );
    expect(alert.nativeElement.textContent).toContain(
      `Are you sure you want to publish these languages: Chinese, French?`,
    );
  });

  it('shows confirm message to create a draft for selected languages', () => {
    comp.actionType = 'createDrafts';
    comp.showConfirmAlert();
    fixture.detectChanges();

    const alert: DebugElement = fixture.debugElement.query(
      By.directive(NgbAlert),
    );
    expect(alert.nativeElement.textContent).toContain(
      `Are you sure you want to generate a draft for these languages: Chinese, French?`,
    );
  });

  describe('Publish languages', () => {
    it('shows confirm message to publish selected languages', () => {
      comp.showConfirmAlert();
      fixture.detectChanges();
      spyOn(comp, 'renderMessage');
      comp.publishOrCreateDrafts();
      expect(comp.renderMessage).toHaveBeenCalledWith(
        MessageType.success,
        'Publishing translations...',
      );
    });
  });
});
