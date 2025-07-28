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
import { UpdateResourceComponent } from './update-resource.component';

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
