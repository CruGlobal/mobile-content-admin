import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgArrayPipesModule } from 'ngx-pipes';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolGroupService } from '../../../service/tool-group/tool-group.service';
import { LanguageService } from '../../../service/language.service';
import {
  RuleTypeEnum,
  ToolGroup,
  ToolGroupRule,
} from '../../../models/tool-group';
import { Language } from '../../../models/language';
import { ToolGroupMocks } from '../../../_tests/toolGroupMocks';
import { ToolGroupRuleReuseableComponent } from '../../edit-tool-group-rule-reuseable/tool-group-rule-reuseable.component';
import { UpdateToolGroupComponent } from './update-tool-group.component';

describe('UpdateToolGroupComponent', () => {
  let comp: UpdateToolGroupComponent;
  let fixture: ComponentFixture<UpdateToolGroupComponent>;

  const toolGroupServiceStub = ({
    createOrUpdateToolGroup() {},
    createOrUpdateRule() {},
  } as unknown) as ToolGroupService;
  const languageServiceStub = ({
    getLanguages() {},
  } as unknown) as LanguageService;

  const mocks = new ToolGroupMocks();

  const toolGroup = new ToolGroup();
  const toolGroupRule = new ToolGroupRule();
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
    spyOn(languageServiceStub, 'getLanguages').and.returnValue(
      Promise.resolve<Language[]>([mocks.languageUKMock]),
    );

    TestBed.configureTestingModule({
      declarations: [UpdateToolGroupComponent, ToolGroupRuleReuseableComponent],
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

    fixture = TestBed.createComponent(UpdateToolGroupComponent);
    comp = fixture.componentInstance;
    comp.toolGroup = mocks.toolGroupFullDetails();
  });

  it('should not update as no changes were made', () => {
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(toolGroupServiceStub.createOrUpdateToolGroup).not.toHaveBeenCalled();
    expect(toolGroupServiceStub.createOrUpdateRule).not.toHaveBeenCalled();
  });

  describe('saveToolGroup()', () => {
    beforeEach(() => {
      comp.ngOnInit();
      comp.toolGroup.name = 'New Name';
      comp.selectedCountries = [mocks.countryUKMock, mocks.countryUSMock];
      comp.selectedLanguages = [mocks.languageUKMock, mocks.languageUSMock];
      comp.selectedPraxisConfidence = [
        {
          name: 'test 1',
          code: '1',
        },
        {
          name: 'test 2',
          code: '2',
        },
      ];
      comp.selectedPraxisOpenness = [
        {
          name: 'test 3',
          code: '3',
        },
      ];
    });

    it('should update Tool Group but not rules resource', () => {
      fixture.debugElement
        .query(By.css('.btn.btn-success'))
        .nativeElement.click();

      expect(toolGroupServiceStub.createOrUpdateToolGroup).toHaveBeenCalled();
      expect(toolGroupServiceStub.createOrUpdateRule).not.toHaveBeenCalled();
    });

    it('should update Country rule', () => {
      comp.selectedCountries = [mocks.countryUKMock];
      fixture.debugElement
        .query(By.css('.btn.btn-success'))
        .nativeElement.click();

      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        comp.toolGroup.id,
        comp.countryRule.id,
        comp.countryRule['negative-rule'],
        [mocks.countryUKMock.code],
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
        [mocks.countryUKMock.code, mocks.countryUSMock.code],
        RuleTypeEnum.COUNTRY,
      );
    });

    it('should update Langauge rule', () => {
      comp.selectedLanguages = [mocks.languageUSMock];
      fixture.debugElement
        .query(By.css('.btn.btn-success'))
        .nativeElement.click();

      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        comp.toolGroup.id,
        comp.languageRule.id,
        comp.languageRule['negative-rule'],
        [mocks.languageUSMock.code],
        RuleTypeEnum.LANGUAGE,
      );
    });

    it('should update Langauge rule as negative rule changed', () => {
      comp.languageRule['negative-rule'] = false;
      fixture.debugElement
        .query(By.css('.btn.btn-success'))
        .nativeElement.click();

      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        comp.toolGroup.id,
        comp.languageRule.id,
        comp.languageRule['negative-rule'],
        [mocks.languageUKMock.code, mocks.languageUSMock.code],
        RuleTypeEnum.LANGUAGE,
      );
    });

    it('should update Langauge rule', () => {
      comp.selectedPraxisConfidence = [
        {
          name: 'test 1',
          code: '1',
        },
      ];
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
