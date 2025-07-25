import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgArrayPipesModule } from 'ngx-pipes';
import { ToolGroupMocks } from '../../../_tests/toolGroupMocks';
import { Language } from '../../../models/language';
import {
  RuleTypeEnum,
  ToolGroup,
  ToolGroupRule,
} from '../../../models/tool-group';
import { LanguageService } from '../../../service/language.service';
import { ToolGroupService } from '../../../service/tool-group/tool-group.service';
import { ToolGroupRuleReuseableComponent } from '../../edit-tool-group-rule-reuseable/tool-group-rule-reuseable.component';
import { CreateToolGroupComponent } from './create-tool-group.component';

describe('CreateToolGroupComponent', () => {
  let comp: CreateToolGroupComponent;
  let fixture: ComponentFixture<CreateToolGroupComponent>;

  const toolGroupServiceStub = ({
    createOrUpdateToolGroup() {},
    createOrUpdateRule() {},
  } as unknown) as ToolGroupService;
  const languageServiceStub = ({
    getLanguages() {},
  } as unknown) as LanguageService;

  const toolGroup = new ToolGroup();
  const toolGroupRule = new ToolGroupRule();
  const createdToolGroupID = 16;
  const mocks = new ToolGroupMocks();

  beforeEach(() => {
    spyOn(toolGroupServiceStub, 'createOrUpdateToolGroup').and.returnValue(
      Promise.resolve<ToolGroup>({
        ...toolGroup,
        id: createdToolGroupID,
      }),
    );
    spyOn(toolGroupServiceStub, 'createOrUpdateRule').and.returnValue(
      Promise.resolve<ToolGroupRule>(toolGroupRule),
    );
    spyOn(languageServiceStub, 'getLanguages').and.returnValue(
      Promise.resolve<Language[]>([mocks.languageUKMock]),
    );

    TestBed.configureTestingModule({
      declarations: [CreateToolGroupComponent, ToolGroupRuleReuseableComponent],
      imports: [
        NgbModule,
        FormsModule,
        NgArrayPipesModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ToolGroupService, useValue: toolGroupServiceStub },
        { provide: LanguageService, useValue: languageServiceStub },
        { provide: NgbActiveModal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateToolGroupComponent);
    comp = fixture.componentInstance;
    comp.toolGroup.name = 'New Tool Group';
  });

  it('creates tool group', () => {
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(toolGroupServiceStub.createOrUpdateToolGroup).toHaveBeenCalledWith(
      comp.toolGroup,
      false,
    );
  });

  it('creates Country Rule', (done) => {
    comp.selectedCountries = [mocks.countryUKMock];
    comp.countryRule['negative-rule'] = true;
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(toolGroupServiceStub.createOrUpdateToolGroup).toHaveBeenCalledWith(
      comp.toolGroup,
      false,
    );

    setTimeout(() => {
      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        createdToolGroupID,
        null,
        true,
        ['GB'],
        RuleTypeEnum.COUNTRY,
      );
      done();
    });
  });

  it('creates Language Rule', (done) => {
    comp.selectedLanguages = [mocks.languageUKMock];
    comp.languageRule['negative-rule'] = false;
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(toolGroupServiceStub.createOrUpdateToolGroup).toHaveBeenCalledWith(
      comp.toolGroup,
      false,
    );

    setTimeout(() => {
      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        createdToolGroupID,
        null,
        false,
        ['en-GB'],
        RuleTypeEnum.LANGUAGE,
      );
      done();
    });
  });

  it('creates Praxis Rule', (done) => {
    comp.selectedPraxisConfidence = [
      {
        name: 'test 1',
        code: '0',
      },
    ];
    comp.selectedPraxisOpenness = [
      {
        name: 'test 1',
        code: '3',
      },
      {
        name: 'test 1',
        code: '4',
      },
    ];
    comp.praxisRule['negative-rule'] = false;
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(toolGroupServiceStub.createOrUpdateToolGroup).toHaveBeenCalledWith(
      comp.toolGroup,
      false,
    );

    setTimeout(() => {
      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        createdToolGroupID,
        null,
        false,
        {
          confidence: ['0'],
          openness: ['3', '4'],
        },
        RuleTypeEnum.PRAXIS,
      );
      done();
    });
  });
});
