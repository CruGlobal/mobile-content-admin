import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MultipleDraftGeneratorComponent} from './multiple-draft-generator.component';
import {FormsModule} from '@angular/forms';
import {DraftService} from '../../service/draft.service';

describe('MultipleDraftGeneratorComponent', () => {
  let comp: MultipleDraftGeneratorComponent;
  let fixture: ComponentFixture<MultipleDraftGeneratorComponent>;

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
  });

  it('only shows published translations', () => {

  });
});
