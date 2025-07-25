import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AceEditorDirective } from 'ng2-ace-editor';
import { NgArrayPipesModule } from 'ngx-pipes';
import { Resource } from '../../../models/resource';
import { ResourceService } from '../../../service/resource/resource.service';
import { ResourceTypeService } from '../../../service/resource-type.service';
import { SystemService } from '../../../service/system.service';
import { XmlEditorComponent } from '../../xml-editor/xml-editor.component';
import { CreateResourceComponent } from './create-resource.component';

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
      imports: [
        NgbModule,
        FormsModule,
        NgArrayPipesModule,
        HttpClientTestingModule,
      ],
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
