import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LanguageService} from '../../service/language.service';
import {FormsModule} from '@angular/forms';
import {ResourcesComponent} from './resources.component';
import {ResourceService} from '../../service/resource/resource.service';
import {TranslationComponent} from '../translation/translation.component';
import {Resource} from '../../models/resource';
import {Translation} from '../../models/translation';
import {Language} from '../../models/language';
import anything = jasmine.anything;
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {DraftService} from '../../service/draft.service';

describe('ResourcesComponent', () => {
  let comp:    ResourcesComponent;
  let fixture: ComponentFixture<ResourcesComponent>;

  const buildTranslation = (languageId): Translation => {
    const t = new Translation();
    t.language = new Language();
    t.language['_placeHolder'] = true;
    t.language.id = languageId;

    return t;
  };

  const resourceServiceStub = {
    getResources() {}
  };
  const languageServiceStub = {
    getLanguage() {}
  };

  const resource: Resource = new Resource();

  beforeEach(async(() => {
    spyOn(resourceServiceStub, 'getResources').and.returnValue(Promise.resolve([ resource ]));
    spyOn(languageServiceStub, 'getLanguage').and.returnValue(Promise.resolve( { _placeHolder: true } ));

    TestBed.configureTestingModule({
      declarations: [ ResourcesComponent, TranslationComponent ],
      imports: [ NgbModule.forRoot(), FormsModule ],
      providers: [
        {provide: ResourceService, useValue: resourceServiceStub},
        {provide: LanguageService, useValue: languageServiceStub},
        {provide: NgbModal},
        {provide: DraftService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesComponent);
    comp = fixture.componentInstance;
  });

  it('should include pages when loading resources', (done) => {
    comp.loadResources();

    setTimeout(() => {
      expect(resourceServiceStub.getResources).toHaveBeenCalledWith('translations,pages');

      done();
    });
  });

  describe('loading languages', () => {
    const languageIdOne = 23;
    const languageIdTwo = 24;

    beforeEach(() => {
      resource['latest-drafts-translations'] = [ buildTranslation(languageIdOne), buildTranslation(languageIdTwo) ];
    });

    it('should be done latest drafts and translations', (done) => {
      comp.loadResources();

      setTimeout(() => {
        expect(languageServiceStub.getLanguage).toHaveBeenCalledWith(languageIdOne, anything());
        expect(languageServiceStub.getLanguage).toHaveBeenCalledWith(languageIdTwo, anything());

        done();
      });
    });

    it('should include custom pages when loading a language', (done) => {
      comp.loadResources();

      setTimeout(() => {
        expect(languageServiceStub.getLanguage).toHaveBeenCalledWith(anything(), 'custom_pages');

        done();
      });
    });

    it('if not completed should not show translations', (done) => {
      comp.loadResources();

      setTimeout(() => {
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.directive(TranslationComponent)).length).toBe(0);

        done();
      });
    });
  });
});
