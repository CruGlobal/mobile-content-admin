import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LanguageService} from '../../service/language.service';
import {FormsModule} from '@angular/forms';
import {ResourcesComponent} from './resources.component';
import {ResourceService} from '../../service/resource.service';
import {TranslationComponent} from '../translation/translation.component';

describe('LanguagesComponent', () => {
  let comp:    ResourcesComponent;
  let fixture: ComponentFixture<ResourcesComponent>;

  const resourceServiceStub = {
    getResources() {}
  };

  beforeEach(async(() => {
    spyOn(resourceServiceStub, 'getResources').and.returnValue(Promise.resolve([]));

    TestBed.configureTestingModule({
      declarations: [ ResourcesComponent, TranslationComponent ],
      imports: [ NgbModule.forRoot(), FormsModule ],
      providers: [
        {provide: ResourceService, useValue: resourceServiceStub},
        {provide: LanguageService},
        {provide: NgbModal}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesComponent);
    comp = fixture.componentInstance;
  });

  describe('loading translations and pages', () => {
    it('should include pages ', (done) => {
      comp.loadResources();

      setTimeout(() => {
        expect(resourceServiceStub.getResources).toHaveBeenCalledWith('translations,pages');

        done();
      });
    });
  });
});
