import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateResourceLanguageComponent } from './update-resource-language.component';
import { XmlEditorComponent } from '../../xml-editor/xml-editor.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResourceLanguageService } from '../../../service/resource-language/resource-language.service';
import { SystemService } from '../../../service/system.service';
import { ResourceTypeService } from '../../../service/resource-type.service';
import { FormsModule } from '@angular/forms';
import { AceEditorDirective } from 'ng2-ace-editor';
import { By } from '@angular/platform-browser';
import { ResourceLanguage } from '../../../models/resource-language';

describe('UpdateResourceLanguageComponent', () => {
  let comp: UpdateResourceLanguageComponent;
  let fixture: ComponentFixture<UpdateResourceLanguageComponent>;

  const resourceLanguage = new ResourceLanguage();
  const resourceLanguageServiceStub = ({
    update() {},
  } as unknown) as ResourceLanguageService;

  beforeEach(() => {
    spyOn(resourceLanguageServiceStub, 'update').and.returnValue(
      Promise.resolve<ResourceLanguage>(null),
    );

    TestBed.configureTestingModule({
      declarations: [
        UpdateResourceLanguageComponent,
        XmlEditorComponent,
        AceEditorDirective,
      ],
      imports: [NgbModule.forRoot(), FormsModule],
      providers: [
        {
          provide: ResourceLanguageService,
          useValue: resourceLanguageServiceStub,
        },
        { provide: SystemService },
        { provide: ResourceTypeService },
        { provide: NgbActiveModal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateResourceLanguageComponent);
    comp = fixture.componentInstance;
    comp.resourceLanguage = resourceLanguage;
  });

  it('updates resource when clicking on save button', () => {
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(resourceLanguageServiceStub.update).toHaveBeenCalledWith(
      resourceLanguage,
    );
  });
});
