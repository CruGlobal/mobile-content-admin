import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgArrayPipesModule } from 'ngx-pipes';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolGroupService } from '../../../service/tool-group/tool-group.service';
import { LanguageBCP47Service } from '../../../service/languages-bcp47-tag.service';
import { RuleTypeEnum, ToolGroup, ToolGroupRule } from '../../../models/tool-group';
import {languageUKMock, countryUKMock } from '../../../_tests/toolGroupMocks'
import { ToolGroupRuleReuseableComponent } from '../../edit-tool-group-rule-reuseable/tool-group-rule-reuseable.component';
import { CreateToolGroupComponent } from './create-tool-group.component';


describe('CreateToolGroupComponent', () => {
  let comp: CreateToolGroupComponent;
  let fixture: ComponentFixture<CreateToolGroupComponent>;

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
        CreateToolGroupComponent,
        ToolGroupRuleReuseableComponent,
      ],
      imports: [NgbModule.forRoot(), FormsModule, NgArrayPipesModule],
      providers: [
        { provide: ToolGroupService, useValue: toolGroupServiceStub },
        { provide: LanguageBCP47Service, useValue: languageBCP47ServiceStub },
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

    expect(toolGroupServiceStub.createOrUpdateToolGroup).toHaveBeenCalledWith(comp.toolGroup, false);
  });

  it('creates Country Rule', (done) => {
    comp.selectedCountries = [countryUKMock]
    comp.countryRule['negative-rule'] = true
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(toolGroupServiceStub.createOrUpdateToolGroup).toHaveBeenCalledWith(comp.toolGroup, false);

    setTimeout(() => {
      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(createdToolGroupID, null, true, ['GB'], RuleTypeEnum.COUNTRY);
      done();
    })
  });

  it('creates Language Rule', (done) => {
    comp.selectedLanguages = [languageUKMock]
    comp.languageRule['negative-rule'] = false
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(toolGroupServiceStub.createOrUpdateToolGroup).toHaveBeenCalledWith(comp.toolGroup, false);

    setTimeout(() => {
      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(createdToolGroupID, null, false, ['en-GB'], RuleTypeEnum.LANGUAGE);
      done();
    })
  });

  it('creates Praxis Rule', (done) => {
    comp.selectedPraxisConfidence = [{
      name: 'test 1',
      code: '0',
    }];
    comp.selectedPraxisOpenness = [
      {
        name: 'test 1',
        code: '3',
      },
      {
        name: 'test 1',
        code: '4',
      }
    ];
    comp.praxisRule['negative-rule'] = false
    fixture.debugElement
      .query(By.css('.btn.btn-success'))
      .nativeElement.click();

    expect(toolGroupServiceStub.createOrUpdateToolGroup).toHaveBeenCalledWith(comp.toolGroup, false);

    setTimeout(() => {
      expect(toolGroupServiceStub.createOrUpdateRule).toHaveBeenCalledWith(
        createdToolGroupID,
        null,
        false,
        {
          confidence: ['0'],
          openness: ['3','4'],
        },
        RuleTypeEnum.PRAXIS
      );
      done();
    })
  });
});
