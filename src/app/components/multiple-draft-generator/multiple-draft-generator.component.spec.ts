import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MultipleDraftGeneratorComponent} from './multiple-draft-generator.component';
import {FormsModule} from '@angular/forms';
import {DraftService} from '../../service/draft.service';
import {Resource} from '../../models/resource';
import {Translation} from '../../models/translation';
import {By} from '@angular/platform-browser';
import {NgbButtonLabel} from '@ng-bootstrap/ng-bootstrap/buttons/label';
import {Language} from '../../models/language';

describe('MultipleDraftGeneratorComponent', () => {
  let comp: MultipleDraftGeneratorComponent;
  let fixture: ComponentFixture<MultipleDraftGeneratorComponent>;

  const buildTranslation = (is_published) => {
    const t = new Translation();
    t.language = new Language();
    t.is_published = is_published;
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

    const r = new Resource();
    r['latest-drafts-translations'] = [ buildTranslation(true), buildTranslation(false), buildTranslation(true) ];
    comp.resource = r;

    fixture.detectChanges();
  });

  it('only shows languages without drafts', () => {
    expect(fixture.debugElement.queryAll(By.directive(NgbButtonLabel)).length).toBe(2);
  });
});
