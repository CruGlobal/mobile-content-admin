import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { ResourceService } from '../../service/resource/resource.service';
import { LanguageService } from '../../service/language.service';
import { Resource } from '../../models/resource';
import { CountriesType, PraxisTypeEnum, ToolGroup } from '../../models/tool-group';
import { Language } from '../../models/language';
import { ToolGroupMocks } from '../../_tests/toolGroupMocks';
import { ToolGroupsComponent } from './tool-groups.component';
import { ToolGroupComponent } from '../tool-group/tool-group.component';
import { ToolGroupRuleReuseableComponent } from '../edit-tool-group-rule-reuseable/tool-group-rule-reuseable.component';

describe('ToolGroupsComponent', () => {
  let comp: ToolGroupsComponent;
  let fixture: ComponentFixture<ToolGroupsComponent>;
  const mocks = new ToolGroupMocks();

  const resourceServiceStub = ({
    getResources() {},
  } as unknown) as ResourceService;
  const toolGroupServiceStub = ({
    getToolGroups() {},
  } as unknown) as ToolGroupService;
  const languageServiceStub = ({
    getLanguages() {
      return mocks.getLanguagesResponse;
    },
  } as unknown) as LanguageService;

  const resource: Resource = new Resource();
  const toolGroup: ToolGroup = new ToolGroup();

  beforeEach(async(() => {
    spyOn(resourceServiceStub, 'getResources').and.returnValue(
      Promise.resolve([resource]),
    );
    spyOn(toolGroupServiceStub, 'getToolGroups').and.returnValue(
      Promise.resolve([toolGroup]),
    );
    spyOn(languageServiceStub, 'getLanguages').and.returnValue(
      Promise.resolve<Language[]>(mocks.getLanguagesResponse),
    );
    TestBed.configureTestingModule({
      declarations: [ToolGroupsComponent, ToolGroupComponent, ToolGroupRuleReuseableComponent],
      imports: [NgbModule.forRoot(), FormsModule],
      providers: [
        { provide: ResourceService, useValue: resourceServiceStub },
        { provide: ToolGroupService, useValue: toolGroupServiceStub },
        { provide: LanguageService, useValue: languageServiceStub },
        { provide: NgbModal },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolGroupsComponent);
    comp = fixture.componentInstance;
  });

  it('should load tool grops and resources', (done) => {
    comp.ngOnInit();
    setTimeout(() => {
      expect(resourceServiceStub.getResources).toHaveBeenCalledWith();
      expect(toolGroupServiceStub.getToolGroups).toHaveBeenCalledWith();
      done();
    });
  });

  it('should load Tool Groups', (done) => {
    comp.loadToolGroups();
    setTimeout(() => {
      expect(comp.toolGroups).toEqual([toolGroup]);
      done();
    });
  });

  const itemOne = {
    code: 'VN'
  } as unknown as CountriesType
  const itemTwo = {
    code: 'UK'
  } as unknown as CountriesType

  it('should update countries', () => {
    comp.ngOnInit()
    comp.updateSelected(
      [
        itemOne,
      ],
      'country',
      undefined
    );

    expect(comp.testerSelectedCountries).toEqual('VN');
    expect(comp.testerCountryRule.countries).toEqual(['VN']);
  });

  it('should update countries', () => {
    comp.ngOnInit()
    comp.updateSelected(
      [
        itemOne,
        itemTwo,
      ],
      'country',
      undefined
    );
    expect(comp.testerSelectedCountries).toEqual('VN');
    expect(comp.testerCountryRule.countries).toEqual(['VN']);
  });

  it('should update languages', () => {
    comp.ngOnInit()
    comp.updateSelected(
      [
        itemOne,
        itemTwo,
      ],
      'language',
      undefined
    );
    expect(comp.testerSelectedLanguages).toEqual(['VN', 'UK']);
  });

  it('should update Praxis', () => {
    comp.ngOnInit()
    comp.updateSelected(
      [
        itemOne,
        itemTwo,
      ],
      'praxis',
      PraxisTypeEnum.CONFIDENCE
    );
    expect(comp.testerSelectedPraxisConfidence).toEqual('VN');
    expect(comp.testerPraxisRule.confidence).toEqual(['VN']);
  });
});
