import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XmlEditorComponent } from '../../xml-editor/xml-editor.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResourceService } from '../../../service/resource/resource.service';
import { SystemService } from '../../../service/system.service';
import { ResourceTypeService } from '../../../service/resource-type.service';
import { CreateResourceComponent } from './create-resource.component';
import { FormsModule } from '@angular/forms';
import { AceEditorDirective } from 'ng2-ace-editor';
import { By } from '@angular/platform-browser';
import { Resource } from '../../../models/resource';

describe('CreateResourceComponent', () => {
  let comp: CreateResourceComponent;
  let fixture: ComponentFixture<CreateResourceComponent>;

  const resourceServiceStub = ({
    create() {},
  } as unknown) as ResourceService;

  beforeEach(() => {
    spyOn(resourceServiceStub, 'create').and.returnValue(
      Promise.resolve<Resource>(null),
    );

    TestBed.configureTestingModule({
      declarations: [
        CreateResourceComponent,
        XmlEditorComponent,
        AceEditorDirective,
      ],
      imports: [NgbModule.forRoot(), FormsModule],
      providers: [
        { provide: ResourceService, useValue: resourceServiceStub },
        { provide: SystemService },
        { provide: ResourceTypeService },
        { provide: NgbActiveModal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateResourceComponent);
    comp = fixture.componentInstance;
    comp.resource.name = 'Satisfied?';
  });

  it('creates resource', () => {
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(resourceServiceStub.create).toHaveBeenCalledWith(comp.resource);
  });
});
