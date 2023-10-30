import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash'
import { NgArrayPipesModule } from 'ngx-pipes';
import { LanguageBCP47Service } from '../../service/languages-bcp47-tag.service';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { RuleTypeEnum, ToolGroup, ToolGroupRule, RulesType, PraxisTypeEnum } from '../../models/tool-group';
import { ToolGroupRuleReuseableComponent } from './tool-group-rule-reuseable.component';
import {languageUKMock, countryUKMock, countryUSMock, languageUSMock } from '../../_tests/toolGroupMocks'

describe('ToolGroupRuleReuseableComponent', () => {
  let comp: ToolGroupRuleReuseableComponent;
  let fixture: ComponentFixture<ToolGroupRuleReuseableComponent>;

  const toolGroupServiceStub = ({
    praxisConfidentData: {
      0: {
        name: 'Confidence 1'
      },
      1: {
        name: 'Confidence 2'
      },
      2: {
        name: 'Confidence 3'
      }
    },
    praxisOpennessData: {
      0: {
        name: 'Openness 1'
      },
      1: {
        name: 'Openness 2'
      },
      2: {
        name: 'Openness 3'
      }
    }
  } as unknown) as ToolGroupService;
  const languageBCP47ServiceStub = ({
    getLanguage() {},
    getLanguages(){
      return [
        {
          code: 'ar-SA',
          language: 'Arabic',
          region: 'Saudi Arabia',
          name: 'Arabic (Saudi Arabia)',
        },
        {
          code: 'en-US',
          language: 'English',
          region: 'United States',
          name: 'English (United States)',
        },
        {
          code: 'en-GB',
          language: 'English',
          region: 'United Kingdom',
          name: 'English (British)',
        },
      ]
    }
  } as unknown) as LanguageBCP47Service;

  const toolGroup = new ToolGroup()
  toolGroup.id = 4;

  beforeEach(() => {
    spyOn(languageBCP47ServiceStub, 'getLanguage').and.callFake((code) => {
      if (code === 'en-GB') return languageUKMock;
      if (code === 'en-US') return languageUSMock;
    })

    TestBed.configureTestingModule({
      declarations: [
        ToolGroupRuleReuseableComponent,
      ],
      imports: [NgbModule.forRoot(), FormsModule, NgArrayPipesModule],
      providers: [
        { provide: ToolGroupService, useValue: toolGroupServiceStub },
        { provide: LanguageBCP47Service, useValue: languageBCP47ServiceStub },
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
    })

    it('should assign the country data', () => {
      toolGroupRule.countries = ['GB', 'US']
      comp.rule = toolGroupRule as RulesType;
      comp.ruleType = RuleTypeEnum.COUNTRY
      comp.praxisType = undefined
      comp.ngOnInit()

      expect(comp.items[0]).toEqual({
        code: 'AD',
        name: 'Andorra',
        native: 'Andorra',
        phone: [ 376 ],
        continent: 'EU',
        capital: 'Andorra la Vella',
        currency: [ 'EUR' ],
        languages: [ 'ca' ],
      })
      expect(comp.selectedItems).toEqual([
        countryUKMock,
        countryUSMock
      ])
      expect(comp.name).toEqual('Countries')
    });

    it('should assign the language data', () => {
      toolGroupRule.languages = ['en-GB', 'en-US']
      comp.rule = toolGroupRule as RulesType;
      comp.ruleType = RuleTypeEnum.LANGUAGE
      comp.praxisType = undefined
      comp.ngOnInit()

      expect(comp.items[0]).toEqual({
        code: 'ar-SA',
        language: 'Arabic',
        region: 'Saudi Arabia',
        name: 'Arabic (Saudi Arabia)',
      })
      expect(comp.selectedItems).toEqual([
        languageUKMock,
        languageUSMock
      ])
      expect(comp.name).toEqual('Languages')
    });

    it('should assign the praxis confidence data', () => {
      toolGroupRule.confidence = ['0','2']
      comp.rule = toolGroupRule as RulesType;
      comp.ruleType = RuleTypeEnum.PRAXIS
      comp.praxisType = PraxisTypeEnum.CONFIDENCE
      comp.ngOnInit()

      expect(comp.items[0]).toEqual({
        code: '0',
        name: 'Confidence 1'
      })
      expect(comp.selectedItems).toEqual([
        {
          code: '0',
          name: 'Confidence 1'
        },
        {
          code: '2',
          name: 'Confidence 3',
        }
      ])
      expect(comp.name).toEqual('Confidence')
    });

    it('should assign the praxis openness data', () => {
      toolGroupRule.openness = ['1']
      comp.rule = toolGroupRule as RulesType;
      comp.ruleType = RuleTypeEnum.PRAXIS
      comp.praxisType = PraxisTypeEnum.OPENNESS
      comp.ngOnInit()

      expect(comp.items[0]).toEqual({
        code: '0',
        name: 'Openness 1'
      })
      expect(comp.selectedItems).toEqual([
        {
          code: '1',
          name: 'Openness 2'
        },
      ])
      expect(comp.name).toEqual('Openness')
    });
  });
});
