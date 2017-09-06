import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UpdateResourceComponent} from './update-resource.component';
import {XmlEditorComponent} from '../../xml-editor/xml-editor.component';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ResourceService} from '../../../service/resource.service';
import {SystemService} from '../../../service/system.service';
import {ResourceTypeService} from '../../../service/resource-type.service';
import {FormsModule} from '@angular/forms';
import {AceEditorDirective} from 'ng2-ace-editor';

describe('UpdateResourceComponent', () => {
  let comp:    UpdateResourceComponent;
  let fixture: ComponentFixture<UpdateResourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateResourceComponent, XmlEditorComponent, AceEditorDirective ],
      imports: [ NgbModule.forRoot(), FormsModule ],
      providers: [
        {provide: ResourceService},
        {provide: SystemService},
        {provide: ResourceTypeService},
        {provide: NgbActiveModal}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateResourceComponent);
    comp = fixture.componentInstance;
  });

  it('updates resource', () => {

  });
});
