import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { NgArrayPipesModule } from 'ngx-pipes';
import { ToolGroupMocks } from '../../_tests/toolGroupMocks';
import {
  RuleTypeEnum,
  ToolGroupRule,
  RulesType,
  CountriesType,
  PraxisTypeEnum,
  Praxis,
} from '../../models/tool-group';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { ToolGroupRuleReuseableComponent } from '../edit-tool-group-rule-reuseable/tool-group-rule-reuseable.component';
import { ToolGroupRuleComponent } from './tool-group-rule.component';

describe('ToolGroupRuleComponent', () => {
  let comp: ToolGroupRuleComponent;
  let fixture: ComponentFixture<ToolGroupRuleComponent>;

  const toolGroupServiceStub = ({
    deleteRule() {},
    createOrUpdateRule() {},
  } as unknown) as ToolGroupService;

  const mocks = new ToolGroupMocks();
  const toolGroupRule = new ToolGroupRule();
  const toolGroupFullDetails = mocks.toolGroupFullDetails();

  beforeEach(() => {
    spyOn(toolGroupServiceStub, 'deleteRule').and.returnValue(
      Promise.resolve({
        status: 'success',
      }),
    );
    spyOn(toolGroupServiceStub, 'createOrUpdateRule').and.returnValue(
      Promise.resolve<ToolGroupRule>(toolGroupRule),
    );

    TestBed.configureTestingModule({
      declarations: [ToolGroupRuleComponent, ToolGroupRuleReuseableComponent],
      imports: [
        NgbModule,
        FormsModule,
        NgArrayPipesModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ToolGroupService, useValue: toolGroupServiceStub },
        { provide: NgbActiveModal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolGroupRuleComponent);
    comp = fixture.componentInstance;
    comp.rule = toolGroupFullDetails['rules-country'][0] as RulesType;
    comp.ruleType = RuleTypeEnum.COUNTRY;
  });

  it('ngOnInit', () => {
    comp.ngOnInit();
    expect(comp.isNewRule).toEqual(false);
    expect(comp.ruleData).toEqual([]);
  });

  it('ngOnInit with Praxis', () => {
    comp.rule = toolGroupFullDetails['rules-praxis'][0] as RulesType;
    comp.ruleType = RuleTypeEnum.PRAXIS;
    comp.ngOnInit();
    expect(comp.isNewRule).toEqual(false);
    expect(comp.ruleData).toEqual({
      confidence: [],
      openness: [],
    });
  });

  describe('updateSelected()', () => {
    it('should set Countries data', () => {
      comp.ngOnInit();
      const selectedItems = ([
        {
          code: '5',
          'negative-rule': true,
          'tool-group': {
            id: 5,
          },
          countries: [mocks.countryUKMock.code],
        },
        {
          code: '9',
          'negative-rule': false,
          'tool-group': {
            id: 5,
          },
          countries: [mocks.countryUSMock.code],
        },
      ] as unknown) as CountriesType[];
      comp.updateSelected(selectedItems, null);

      expect(comp.rule.countries).toEqual(['5', '9']);
      expect(comp.ruleData).toEqual(['5', '9']);
    });

    it('should set Praxis - confidence data', () => {
      comp.ruleType = RuleTypeEnum.PRAXIS;
      comp.ngOnInit();
      const selectedItems = ([
        {
          code: '1',
          name: 'test one',
        },
        {
          code: '3',
          name: 'test three',
        },
      ] as unknown) as Praxis[];
      comp.updateSelected(selectedItems, PraxisTypeEnum.CONFIDENCE);

      expect(comp.rule.confidence).toEqual(['1', '3']);
      expect(comp.ruleData.confidence).toEqual(['1', '3']);
    });

    it('should set Praxis - openness data', () => {
      comp.ruleType = RuleTypeEnum.PRAXIS;
      comp.ngOnInit();
      const selectedItems = ([
        {
          code: '2',
          name: 'test two',
        },
        {
          code: '4',
          name: 'test four',
        },
      ] as unknown) as Praxis[];
      comp.updateSelected(selectedItems, PraxisTypeEnum.OPENNESS);

      expect(comp.rule.openness).toEqual(['2', '4']);
      expect(comp.ruleData.openness).toEqual(['2', '4']);
    });
  });

  it('updateNegativeRule()', (done) => {
    comp.ngOnInit();
    expect(comp.rule['negative-rule']).toEqual(false);
    comp.updateNegativeRule(true);
    setTimeout(() => {
      expect(comp.rule['negative-rule']).toEqual(true);
      done();
    });
  });

  it('createOrUpdateRule()', () => {
    comp.createOrUpdateRule();
    expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
      comp.rule['tool-group'].id,
      comp.rule.id,
      comp.rule['negative-rule'],
      comp.ruleData,
      comp.ruleType,
    );
  });

  it('deleteRule()', () => {
    comp.deleteRule();
    expect(toolGroupServiceStub.deleteRule).toHaveBeenCalledWith(
      comp.rule['tool-group'].id,
      comp.rule.id,
      comp.ruleType,
    );
  });
});
