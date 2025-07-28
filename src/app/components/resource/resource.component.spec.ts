import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Language } from '../../models/language';
import { Resource } from '../../models/resource';
import { Translation } from '../../models/translation';
import { DraftService } from '../../service/draft.service';
import { LanguageService } from '../../service/language.service';
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

  const resource: Resource = new Resource();

  beforeEach(
    waitForAsync(() => {
      spyOn(languageServiceStub, 'getLanguage').and.returnValue(
        Promise.resolve(languageStub),
      );

      TestBed.configureTestingModule({
        declarations: [
          ResourcesComponent,
          ResourceComponent,
          TranslationComponent,
          TranslationVersionBadgeComponent,
        ],
        imports: [NgbModule, FormsModule, HttpClientTestingModule],
        providers: [
          { provide: LanguageService, useValue: languageServiceStub },
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
});
