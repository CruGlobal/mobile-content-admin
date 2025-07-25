import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  NgbButtonLabel,
  NgbActiveModal,
  NgbAlert,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Language } from '../../models/language';
import { MessageType } from '../../models/message';
import { Resource } from '../../models/resource';
import { Translation } from '../../models/translation';
import { WindowRefService } from '../../models/window-ref-service';
import { AuthService } from '../../service/auth/auth.service';
import { DraftService } from '../../service/draft.service';
import { LanguageService } from '../../service/language.service';
import { ResourceService } from '../../service/resource/resource.service';
import { TranslationVersionBadgeComponent } from '../translation/translation-version-badge/translation-version-badge.component';
import { MultipleDraftGeneratorComponent } from './multiple-draft-generator.component';

describe('MultipleDraftGeneratorComponent', () => {
  let comp: MultipleDraftGeneratorComponent;
  let fixture: ComponentFixture<MultipleDraftGeneratorComponent>;
  let customResourceServiceStub;
  let customDraftServiceStub;

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
    customResourceServiceStub = {
      getResource() {},
    };
    customDraftServiceStub = {
      createDraft() {},
      publishDraft() {},
    };

    spyOn(customResourceServiceStub, 'getResource').and.returnValue(
      Promise.resolve({
        'latest-drafts-translations': [
          {
            language: { id: 1 },
            'publishing-errors': null,
            'is-published': false,
          },
        ],
      }),
    );
    spyOn(customDraftServiceStub, 'createDraft').and.returnValue(
      Promise.resolve(),
    );
    spyOn(customDraftServiceStub, 'publishDraft').and.returnValue(
      Promise.resolve([
        {
          'publishing-errors': null,
          'is-published': false,
        },
      ]),
    );

    customResourceServiceStub.getResource();

    TestBed.configureTestingModule({
      declarations: [
        MultipleDraftGeneratorComponent,
        TranslationVersionBadgeComponent,
      ],
      imports: [NgbModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: DraftService, useValue: customDraftServiceStub },
        { provide: NgbActiveModal },
        { provide: ResourceService, useValue: customResourceServiceStub },
        WindowRefService,
        AuthService,
        LanguageService,
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

  describe('publishOrCreateDrafts() Publish', () => {
    it('should send publish 2 languages, and call isPublished() every 5 seconds ', fakeAsync(() => {
      comp.showConfirmAlert();
      fixture.detectChanges();
      spyOn(comp, 'renderMessage');
      spyOn(comp, 'isPublished');
      comp.publishOrCreateDrafts();
      expect(comp.renderMessage).toHaveBeenCalledWith(
        MessageType.success,
        'Publishing translations...',
      );

      tick(5500);
      fixture.detectChanges();
      discardPeriodicTasks();

      expect(customDraftServiceStub.publishDraft).toHaveBeenCalledTimes(2);
      expect(comp.errorMessage).toEqual([]);
      expect(comp.isPublished).toHaveBeenCalledTimes(1);

      tick(5500);
      fixture.detectChanges();
      discardPeriodicTasks();

      expect(comp.isPublished).toHaveBeenCalledTimes(2);
    }));

    it('should return publishing errors and warn the user.', fakeAsync(() => {
      customDraftServiceStub.publishDraft.and.returnValue(
        Promise.resolve([
          {
            'publishing-errors': 'Error publishing...',
            'is-published': false,
          },
        ]),
      );
      spyOn(comp, 'renderMessage');
      spyOn(comp, 'isPublished');

      comp.showConfirmAlert();
      fixture.detectChanges();
      comp.publishOrCreateDrafts();

      tick(5500);
      fixture.detectChanges();
      discardPeriodicTasks();

      expect(comp.errorMessage).toEqual([
        'Error publishing...',
        'Error publishing...',
      ]);
    }));
  });
});
