import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { LanguageBCP47Service } from '../../service/languages-bcp47-tag.service';
import { CountryRule, LanguageRule, ToolGroup, ToolGroupRule } from '../..//models/tool-group';
import { languageUKMock, toolGroupFullDetails } from '../../_tests/toolGroupMocks';
import { ToolGroupsComponent } from '../tool-groups/tool-groups.component';
import { ToolGroupComponent } from './tool-group.component';

describe('ResourceComponent', () => {
  let comp: ToolGroupComponent;
  let fixture: ComponentFixture<ToolGroupComponent>;

  const toolGroupServiceStub = ({
    getToolGroup() {},
    praxisConfidentData: {
      0: {
        name: 'Confidence'
      }
    },
    praxisOpennessData: {
      0: {
        name: 'Openness'
      }
    }
  } as unknown) as ToolGroupService;
  const languageBCP47ServiceStub = ({
    getLanguage() {},
  } as unknown) as LanguageBCP47Service;
  const modalServiceStub = ({
    open() {},
  } as unknown) as NgbModal;

  const toolGroup: ToolGroup = new ToolGroup();
  toolGroup.id = 8
  const rule: ToolGroupRule = new ToolGroupRule();
  rule.id = 17;
  rule.languages = ['en-GB', 'en-US'];
  rule.countries = ['US', 'UK'];
  rule.confidence = ['1','5'];
  rule.openness = ['3'];
  rule['tool-group'] = {
    ...toolGroup,
  }

  const modalRef = ({
    componentInstance: {
      source: null,
    },
    result: Promise.resolve()
  } as unknown) as NgbModalRef;


  beforeEach(async(() => {
    spyOn(languageBCP47ServiceStub, 'getLanguage').and.returnValue(
      languageUKMock,
    );
    spyOn(toolGroupServiceStub, 'getToolGroup').and.returnValue(
      Promise.resolve(toolGroupFullDetails),
    );
    spyOn(modalServiceStub, 'open').and.returnValue(modalRef);

    TestBed.configureTestingModule({
      declarations: [
        ToolGroupsComponent,
        ToolGroupComponent,
      ],
      imports: [NgbModule.forRoot(), FormsModule],
      providers: [
        { provide: ToolGroupService, useValue: toolGroupServiceStub },
        { provide: LanguageBCP47Service, useValue: languageBCP47ServiceStub },
        { provide: NgbModal, useValue: modalServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolGroupComponent);
    comp = fixture.componentInstance;
    comp.toolGroup = toolGroup;
    comp.toolGroupsComponent = new ToolGroupsComponent(null, null, null);
  });

  describe('loadAllDetails', () => {
    it('should not call getToolGroup()', async () => {
      comp.hasLoadedInitialDetails = true
      const returnedValue = await comp.loadAllDetails();
      expect(returnedValue).toEqual(toolGroup);
      expect(toolGroupServiceStub.getToolGroup).not.toHaveBeenCalled();
    });
    it('should call getToolGroup()', async () => {
      comp.hasLoadedInitialDetails = false
      const returnedValue = await comp.loadAllDetails();
      expect(returnedValue['rules-praxis'][0].id).toEqual(3)
      expect(returnedValue.tools[0].suggestionsWeight).toEqual('12')
      expect(comp.hasLoadedInitialDetails).toEqual(true)
      expect(toolGroupServiceStub.getToolGroup).toHaveBeenCalled();
    });
  });

  describe('openUpdateModal', () => {
    it('should call loadAllDetails()', (done) => {
      spyOn(comp, 'loadAllDetails')
      comp.openUpdateModal()

      setTimeout(() => {
        expect(comp.loadAllDetails).toHaveBeenCalled()
        done();
      });
    });
  });

  describe('openRuleModal', () => {
    it('should open Rule modal and send Rule data', () => {
      comp.openRuleModal(rule as LanguageRule & CountryRule, 'country')
      expect(modalServiceStub.open).toHaveBeenCalled();
      expect(modalRef.componentInstance.rule).toBe(rule);
      expect(modalRef.componentInstance.ruleType).toBe('country');
    });
  });

  describe('createRule', () => {
    it('should open Rule modal and send new Rule data', () => {
      const newRule = new ToolGroupRule();
      newRule['tool-group'] = comp.toolGroup;
      comp.createRule('country')
      expect(modalServiceStub.open).toHaveBeenCalled();
      expect(modalRef.componentInstance.rule['tool-group'].id).toBe(8);
      expect(modalRef.componentInstance.ruleType).toBe('country');
    });
  });

  describe('addResource', () => {
    it('should open Add Resoiurce modal and send data', () => {
      comp.addResource()
      expect(modalServiceStub.open).toHaveBeenCalled();
      expect(modalRef.componentInstance.resources).toBe(comp.toolGroupsComponent.resources);
      expect(modalRef.componentInstance.toolGroup).toBe(toolGroup);
    });
  });

  describe('handleToggleAccordian', () => {
    it('should call loadAllDetails() when handleToggleAccordian() is called', () => {
      spyOn(comp, 'loadAllDetails')
      comp.showDetails = false
      comp.handleToggleAccordian()
      expect(comp.showDetails).toEqual(true);
      expect(comp.loadAllDetails).toHaveBeenCalled();

    });
  });

  describe('getReadableValue Languages', () => {
    it('should return UK language', () => {
      const value = comp.getReadableValue('en-GB', 'language', null)
      expect(value).toEqual(languageUKMock);
    });
  });

  describe('getReadableValue Praxis Confident', () => {
    it('should return Confidence value', () => {
      const value = comp.getReadableValue('0', 'praxis', 'confidence')
      expect(value).toEqual({
        name: 'Confidence'
      });
    });
  });

  describe('getReadableValue Praxis Openess', () => {
    it('should return Openness value', () => {
      const value = comp.getReadableValue('0', 'praxis', 'openness')
      expect(value).toEqual({
        name: 'Openness'
      });
    });
  });
});
