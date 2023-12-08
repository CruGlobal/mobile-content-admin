import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgArrayPipesModule } from 'ngx-pipes';
import { LanguageService } from '../../service/language.service';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { Language } from '../../models/language';
import { ToolGroupMocks } from '../../_tests/toolGroupMocks';
import {
  RuleTypeEnum,
  ToolGroup,
  ToolGroupRule,
  RulesType,
  PraxisTypeEnum,
} from '../../models/tool-group';
import { ToolGroupRuleReuseableComponent } from './tool-group-rule-reuseable.component';

describe('ToolGroupRuleReuseableComponent', () => {
  let comp: ToolGroupRuleReuseableComponent;
  let fixture: ComponentFixture<ToolGroupRuleReuseableComponent>;

  const toolGroupServiceStub = ({
    praxisConfidentData: {
      0: {
        name: 'Confidence 1',
      },
      1: {
        name: 'Confidence 2',
      },
      2: {
        name: 'Confidence 3',
      },
    },
    praxisOpennessData: {
      0: {
        name: 'Openness 1',
      },
      1: {
        name: 'Openness 2',
      },
      2: {
        name: 'Openness 3',
      },
    },
  } as unknown) as ToolGroupService;
  const mocks = new ToolGroupMocks();

  const languageServiceStub = ({
    getLanguages() {
      return mocks.getLanguagesResponse;
    },
  } as unknown) as LanguageService;

  const toolGroup = new ToolGroup();
  toolGroup.id = 4;

  beforeEach(() => {
    spyOn(languageServiceStub, 'getLanguages').and.returnValue(
      Promise.resolve<Language[]>(mocks.getLanguagesResponse),
    );

    TestBed.configureTestingModule({
      declarations: [ToolGroupRuleReuseableComponent],
      imports: [NgbModule.forRoot(), FormsModule, NgArrayPipesModule],
      providers: [
        { provide: ToolGroupService, useValue: toolGroupServiceStub },
        { provide: LanguageService, useValue: languageServiceStub },
        { provide: NgbActiveModal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolGroupRuleReuseableComponent);
    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    let toolGroupRule;

    beforeEach(() => {
      toolGroupRule = new ToolGroupRule();
      toolGroupRule.id = 5;
      toolGroupRule['tool-group'] = toolGroup;
    });

    it('should assign the country data', () => {
      toolGroupRule.countries = ['GB', 'US'];
      comp.rule = toolGroupRule as RulesType;
      comp.ruleType = RuleTypeEnum.COUNTRY;
      comp.praxisType = undefined;
      comp.ngOnInit();

      expect(comp.items[0]).toEqual(mocks.countryADMock);
      expect(comp.selectedItems).toEqual([
        mocks.countryUKMock,
        mocks.countryUSMock,
      ]);
      expect(comp.name).toEqual('Countries');
    });

    it('should assign the language data', (done) => {
      toolGroupRule.languages = ['en-GB', 'en-US'];
      comp.rule = toolGroupRule as RulesType;
      comp.ruleType = RuleTypeEnum.LANGUAGE;
      comp.praxisType = undefined;
      comp.ngOnInit();

      setTimeout(() => {
        expect(comp.items[0]).toEqual({
          code: 'ar-SA',
          name: 'Arabic (Saudi Arabia)',
          id: 9,
          customPages: null,
          canConfirmDelete: null,
        });
        expect(comp.selectedItems).toEqual([
          mocks.languageUKMock,
          mocks.languageUSMock,
        ]);
        expect(comp.name).toEqual('Languages');
        done();
      });
    });

    it('should assign the praxis confidence data', () => {
      toolGroupRule.confidence = ['0', '2'];
      comp.rule = toolGroupRule as RulesType;
      comp.ruleType = RuleTypeEnum.PRAXIS;
      comp.praxisType = PraxisTypeEnum.CONFIDENCE;
      comp.ngOnInit();

      expect(comp.items[0]).toEqual({
        code: '0',
        name: 'Confidence 1',
      });
      expect(comp.selectedItems).toEqual([
        {
          code: '0',
          name: 'Confidence 1',
        },
        {
          code: '2',
          name: 'Confidence 3',
        },
      ]);
      expect(comp.name).toEqual('Confidence - Praxis');
    });

    it('should assign the praxis openness data', () => {
      toolGroupRule.openness = ['1'];
      comp.rule = toolGroupRule as RulesType;
      comp.ruleType = RuleTypeEnum.PRAXIS;
      comp.praxisType = PraxisTypeEnum.OPENNESS;
      comp.ngOnInit();

      expect(comp.items[0]).toEqual({
        code: '0',
        name: 'Openness 1',
      });
      expect(comp.selectedItems).toEqual([
        {
          code: '1',
          name: 'Openness 2',
        },
      ]);
      expect(comp.name).toEqual('Openness - Praxis');
    });
  });
  describe('handleSelectedItem()', () => {
    let toolGroupRule;

    beforeEach(() => {
      toolGroupRule = new ToolGroupRule();
      toolGroupRule.id = 5;
      toolGroupRule['tool-group'] = toolGroup;
    });

    it('should only allow one item to be selected the country data', () => {
      toolGroupRule.countries = ['GB', 'US'];
      comp.rule = toolGroupRule as RulesType;
      comp.ruleType = RuleTypeEnum.COUNTRY;
      comp.praxisType = undefined;
      comp.limitOneAnswer = true;
      comp.ngOnInit();

      expect(comp.selectedItems).toEqual([
        mocks.countryUKMock,
        mocks.countryUSMock,
      ]);

      comp.handleSelectedItem(mocks.countryADMock);

      expect(comp.selectedItems).toEqual([mocks.countryADMock]);
    });
  });
});
