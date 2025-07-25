import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpdateResourceComponent } from './update-resource.component';
import { XmlEditorComponent } from '../../xml-editor/xml-editor.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResourceService } from '../../../service/resource/resource.service';
import { SystemService } from '../../../service/system.service';
import { ResourceTypeService } from '../../../service/resource-type.service';
import { FormsModule } from '@angular/forms';
import { AceEditorDirective } from 'ng2-ace-editor';
import { By } from '@angular/platform-browser';
import { Resource } from '../../../models/resource';
import { NgArrayPipesModule } from 'ngx-pipes';

describe('UpdateResourceComponent', () => {
  let comp: UpdateResourceComponent;
  let fixture: ComponentFixture<UpdateResourceComponent>;

  const resource = new Resource();
  const resourceServiceStub = ({
    update() {},
  } as unknown) as ResourceService;

  beforeEach(() => {
    spyOn(resourceServiceStub, 'update').and.returnValue(
      Promise.resolve<Resource>(null),
    );

    TestBed.configureTestingModule({
      declarations: [
        UpdateResourceComponent,
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

    fixture = TestBed.createComponent(UpdateResourceComponent);
    comp = fixture.componentInstance;
    comp.resource = resource;
    comp.resource.name = 'Knowing God Personally';
  });

  it('updates resource when clicking on save button', () => {
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(resourceServiceStub.update).toHaveBeenCalledWith(resource);
  });
});
