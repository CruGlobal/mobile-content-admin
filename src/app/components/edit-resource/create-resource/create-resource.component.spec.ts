import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AceEditorDirective } from 'ng2-ace-editor';
import { NgArrayPipesModule } from 'ngx-pipes';
import { ToolGroupMocks } from '../../../_tests/toolGroupMocks';
import { Language } from '../../../models/language';
import { Resource } from '../../../models/resource';
import { System } from '../../../models/system';
import { LanguageService } from '../../../service/language.service';
import { ResourceService } from '../../../service/resource/resource.service';
import { ResourceTypeService } from '../../../service/resource-type.service';
import { SystemService } from '../../../service/system.service';
import { XmlEditorComponent } from '../../xml-editor/xml-editor.component';
import { CreateResourceComponent } from './create-resource.component';

describe('CreateResourceComponent', () => {
  let comp: CreateResourceComponent;
  let fixture: ComponentFixture<CreateResourceComponent>;

  const mocks = new ToolGroupMocks();
  const resourceServiceStub = ({
    create() {},
    getResources() {},
  } as unknown) as ResourceService;
  const systemServiceStub = ({
    getSystems() {},
  } as unknown) as SystemService;
  const resourceTypeServiceStub = ({
    getResourceTypes() {},
  } as unknown) as ResourceTypeService;
  const languageServiceStub = ({
    getLanguages() {},
  } as unknown) as LanguageService;

  beforeEach(() => {
    spyOn(resourceServiceStub, 'create').and.returnValue(
      Promise.resolve<Resource>(null),
    );
    spyOn(resourceServiceStub, 'getResources').and.returnValue(
      Promise.resolve<Resource[]>([]),
    );
    spyOn(systemServiceStub, 'getSystems').and.returnValue(
      Promise.resolve<System[]>([{ id: 1 } as System]),
    );
    spyOn(resourceTypeServiceStub, 'getResourceTypes').and.returnValue(
      Promise.resolve([]),
    );
    spyOn(languageServiceStub, 'getLanguages').and.returnValue(
      Promise.resolve<Language[]>(mocks.getLanguagesResponse),
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
        { provide: SystemService, useValue: systemServiceStub },
        { provide: ResourceTypeService, useValue: resourceTypeServiceStub },
        { provide: LanguageService, useValue: languageServiceStub },
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

  it('loads languages for the Default Language dropdown', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(languageServiceStub.getLanguages).toHaveBeenCalled();
    expect(comp.languages).toEqual(mocks.getLanguagesResponse);

    const options = fixture.debugElement.queryAll(
      By.css('#default_language option'),
    );
    expect(
      options.map((o) => (o.nativeElement as HTMLOptionElement).value),
    ).toEqual(['', 'ar-SA', 'en-US', 'en-GB']);
  });
});
