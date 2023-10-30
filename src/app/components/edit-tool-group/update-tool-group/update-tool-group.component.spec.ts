import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgArrayPipesModule } from 'ngx-pipes';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash'
import { ToolGroupService } from '../../../service/tool-group/tool-group.service';
import { LanguageBCP47Service } from '../../../service/languages-bcp47-tag.service';
import { RuleTypeEnum, ToolGroup, ToolGroupRule } from '../../../models/tool-group';
import {languageUKMock, countryUKMock, toolGroupFullDetails, countryUSMock, languageUSMock } from '../../../_tests/toolGroupMocks'
import { ToolGroupRuleReuseableComponent } from '../../edit-tool-group-rule-reuseable/tool-group-rule-reuseable.component';
import { UpdateToolGroupComponent } from './update-tool-group.component';

describe('UpdateToolGroupComponent', () => {
  let comp: UpdateToolGroupComponent;
  let fixture: ComponentFixture<UpdateToolGroupComponent>;

  const toolGroupServiceStub = ({
    createOrUpdateToolGroup() {},
    createOrUpdateRule() {},
  } as unknown) as ToolGroupService;
  const languageBCP47ServiceStub = ({
    getLanguage() {},
  } as unknown) as LanguageBCP47Service;

  const toolGroup = new ToolGroup()
  const toolGroupRule = new ToolGroupRule()
  const createdToolGroupID = 16;

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
    spyOn(languageBCP47ServiceStub, 'getLanguage').and.returnValue(
      languageUKMock,
    );

    TestBed.configureTestingModule({
      declarations: [
        UpdateToolGroupComponent,
        ToolGroupRuleReuseableComponent,
      ],
      imports: [NgbModule.forRoot(), FormsModule, NgArrayPipesModule],
      providers: [
        { provide: ToolGroupService, useValue: toolGroupServiceStub },
        { provide: LanguageBCP47Service, useValue: languageBCP47ServiceStub },
        { provide: NgbActiveModal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateToolGroupComponent);
    comp = fixture.componentInstance;
    comp.toolGroup = toolGroupFullDetails
  });

  it('should not update as no changes were made', () => {
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(toolGroupServiceStub.createOrUpdateToolGroup).not.toHaveBeenCalled();
    expect(toolGroupServiceStub.createOrUpdateRule).not.toHaveBeenCalled()
  });


  describe('saveToolGroup()', () => {

    beforeEach(() => {
      comp.ngOnInit()
      comp.toolGroup.name = 'New Name';
      comp.selectedCountries = [
        countryUKMock,
        countryUSMock
      ]
      comp.selectedLanguages = [
        languageUKMock,
        languageUSMock
      ]
      comp.selectedPraxisConfidence = [
        {
          name: 'test 1',
          code: '1',
        },
        {
          name: 'test 2',
          code: '2',
        }
      ]
      comp.selectedPraxisOpenness = [
        {
          name: 'test 3',
          code: '3',
        }
      ]
    });


    it('should update Tool Group but not rules resource', () => {
      fixture.debugElement
        .query(By.css('.btn.btn-success'))
        .nativeElement.click();

      expect(toolGroupServiceStub.createOrUpdateToolGroup).toHaveBeenCalled();
      expect(toolGroupServiceStub.createOrUpdateRule).not.toHaveBeenCalled();
    });

    it('should update Country rule', () => {
      comp.selectedCountries = [
        countryUKMock,
      ]
      fixture.debugElement
        .query(By.css('.btn.btn-success'))
        .nativeElement.click();

      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        comp.toolGroup.id,
        comp.countryRule.id,
        comp.countryRule['negative-rule'],
        [countryUKMock.code],
        RuleTypeEnum.COUNTRY,
      );
    });

    it('should update Country rule as negative rule updated', () => {
      comp.countryRule['negative-rule'] = true;
      fixture.debugElement
        .query(By.css('.btn.btn-success'))
        .nativeElement.click();

      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        comp.toolGroup.id,
        comp.countryRule.id,
        comp.countryRule['negative-rule'],
        [countryUKMock.code, countryUSMock.code],
        RuleTypeEnum.COUNTRY,
      );
    });

    it('should update Langauge rule', () => {
      comp.selectedLanguages = [
        languageUSMock
      ]
      fixture.debugElement
        .query(By.css('.btn.btn-success'))
        .nativeElement.click();

      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        comp.toolGroup.id,
        comp.languageRule.id,
        comp.languageRule['negative-rule'],
        [languageUSMock.code],
        RuleTypeEnum.LANGUAGE,
      );
    });

    it('should update Langauge rule as negative rule changed', () => {
      comp.languageRule['negative-rule'] = false
      fixture.debugElement
        .query(By.css('.btn.btn-success'))
        .nativeElement.click();

      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        comp.toolGroup.id,
        comp.languageRule.id,
        comp.languageRule['negative-rule'],
        [languageUKMock.code, languageUSMock.code],
        RuleTypeEnum.LANGUAGE,
      );
    });

    it('should update Langauge rule', () => {
      comp.selectedPraxisConfidence = [
        {
          name: 'test 1',
          code: '1',
        },
      ]
      fixture.debugElement
        .query(By.css('.btn.btn-success'))
        .nativeElement.click();

      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        comp.toolGroup.id,
        comp.praxisRule.id,
        comp.praxisRule['negative-rule'],
        {
          confidence: ['1'],
          openness: ['3'],
        },
        RuleTypeEnum.PRAXIS,
      );
    });
  });
});
