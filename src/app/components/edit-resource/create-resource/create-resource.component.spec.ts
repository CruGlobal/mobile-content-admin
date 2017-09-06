import {ComponentFixture, TestBed} from '@angular/core/testing';
import {XmlEditorComponent} from '../../xml-editor/xml-editor.component';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ResourceService} from '../../../service/resource.service';
import {SystemService} from '../../../service/system.service';
import {ResourceTypeService} from '../../../service/resource-type.service';
import {CreateResourceComponent} from './create-resource.component';
import {FormsModule} from '@angular/forms';
import {AceEditorDirective} from 'ng2-ace-editor';

describe('CreateResourceComponent', () => {
  let comp:    CreateResourceComponent;
  let fixture: ComponentFixture<CreateResourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateResourceComponent, XmlEditorComponent, AceEditorDirective ],
      imports: [ NgbModule.forRoot(), FormsModule ],
      providers: [
        {provide: ResourceService},
        {provide: SystemService},
        {provide: ResourceTypeService},
        {provide: NgbActiveModal}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateResourceComponent);
    comp = fixture.componentInstance;
  });

  it('creates resource', () => {

  });
});
