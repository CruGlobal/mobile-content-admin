import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LanguageService} from '../../service/language.service';
import {FormsModule} from '@angular/forms';
import {ResourcesComponent} from './resources.component';
import {ResourceService} from '../../service/resource/resource.service';
import {TranslationComponent} from '../translation/translation.component';
import {Resource} from '../../models/resource';
import {DraftService} from '../../service/draft.service';
import {ResourceComponent} from '../resource/resource.component';

describe('ResourcesComponent', () => {
  let comp:    ResourcesComponent;
  let fixture: ComponentFixture<ResourcesComponent>;

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
      declarations: [ ResourcesComponent, ResourceComponent, TranslationComponent ],
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
});
