import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LanguageService} from '../../service/language.service';
import {FormsModule} from '@angular/forms';
import {TranslationComponent} from '../translation/translation.component';
import {Resource} from '../../models/resource';
import {Translation} from '../../models/translation';
import {Language} from '../../models/language';
import anything = jasmine.anything;
import {By} from '@angular/platform-browser';
import {DraftService} from '../../service/draft.service';
import {ResourceComponent} from './resource.component';
import {ResourcesComponent} from '../resources/resources.component';

describe('ResourceComponent', () => {
  let comp:    ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;

  const buildTranslation = (languageId): Translation => {
    const t = new Translation();
    t.language = new Language();
    t.language['_placeHolder'] = true;
    t.language.id = languageId;

    return t;
  };

  const languageServiceStub = {
    getLanguage() {}
  };

  const resource: Resource = new Resource();

  beforeEach(async(() => {
    spyOn(languageServiceStub, 'getLanguage').and.returnValue(Promise.resolve( { _placeHolder: true } ));

    TestBed.configureTestingModule({
      declarations: [ ResourcesComponent, ResourceComponent, TranslationComponent ],
      imports: [ NgbModule.forRoot(), FormsModule ],
      providers: [
        {provide: LanguageService, useValue: languageServiceStub},
        {provide: NgbModal},
        {provide: DraftService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceComponent);
    comp = fixture.componentInstance;
    comp.resource = resource;
  });

  describe('loading languages', () => {
    const languageIdOne = 23;
    const languageIdTwo = 24;

    beforeEach(() => {
      resource['latest-drafts-translations'] = [ buildTranslation(languageIdOne), buildTranslation(languageIdTwo) ];
    });

    it('should be done latest drafts and translations', (done) => {
      comp.ngOnInit();

      setTimeout(() => {
        expect(languageServiceStub.getLanguage).toHaveBeenCalledWith(languageIdOne, anything());
        expect(languageServiceStub.getLanguage).toHaveBeenCalledWith(languageIdTwo, anything());

        done();
      });
    });

    it('should include custom pages when loading a language', (done) => {
      comp.ngOnInit();

      setTimeout(() => {
        expect(languageServiceStub.getLanguage).toHaveBeenCalledWith(anything(), 'custom_pages');

        done();
      });
    });

    it('if not completed should not show translations', (done) => {
      comp.ngOnInit();

      setTimeout(() => {
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.directive(TranslationComponent)).length).toBe(0);

        done();
      });
    });
  });
});
