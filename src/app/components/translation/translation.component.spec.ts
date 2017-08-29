import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslationComponent} from './translation.component';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DraftService} from '../../service/draft.service';
import {PageComponent} from '../page/page.component';
import {CustomPageComponent} from '../custom-page/custom-page.component';

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
});
