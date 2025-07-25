import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Language } from '../../models/language';
import { Resource } from '../../models/resource';
import {
  ToolGroup,
  ToolGroupRule,
  CountriesType,
  RuleType,
  PraxisType,
  Praxis,
  RuleTypeEnum,
  PraxisTypeEnum,
} from '../../models/tool-group';
import { LanguageService } from '../../service/language.service';
import { ResourceService } from '../../service/resource/resource.service';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { CreateToolGroupComponent } from '../edit-tool-group/create-tool-group/create-tool-group.component';

@Component({
  selector: 'admin-tool-groups',
  templateUrl: './tool-groups.component.html',
})
export class ToolGroupsComponent implements OnInit {
  toolGroups: ToolGroup[];
  showInstructions = false;
  showTester = false;
  loadingToolGroups = false;
  errorMessage: string;
  resources: Resource[];
  languages: Language[];
  // Tester variables
  testerCountryRule: ToolGroupRule;
  testerLanguageRule: ToolGroupRule;
  testerPraxisRule: ToolGroupRule;
  testerSelectedCountries = '';
  testerSelectedLanguages: string[] = [];
  testerSelectedPraxisConfidence = '';
  testerSelectedPraxisOpenness = '';
  suggestedTools: Resource[] = [];
  loadingSuggestions = false;
  hasAlreadyRunTester = false;

  constructor(
    private toolGroupService: ToolGroupService,
    private modalService: NgbModal,
    private resourceService: ResourceService,
    private languageService: LanguageService,
  ) {}

  ngOnInit(): void {
    this.loadToolGroups();
    this.resourceService.getResources().then((resources) => {
      this.resources = resources;
    });
    this.languageService.getLanguages().then((languages) => {
      this.languages = languages;
    });
    this.testerCountryRule = new ToolGroupRule();
    this.testerLanguageRule = new ToolGroupRule();
    this.testerPraxisRule = new ToolGroupRule();
  }

  loadToolGroups(): Promise<void> {
    this.loadingToolGroups = true;
    return this.toolGroupService
      .getToolGroups()
      .then((toolGroups) => {
        this.toolGroups = toolGroups;
      })
      .catch(this.handleError.bind(this))
      .then(() => {
        this.loadingToolGroups = false;
      });
  }

  trackByFunction(pIx: number, pItem: ToolGroup) {
    if (!pItem || pIx < 0) {
      return null;
    }
    return pItem.id;
  }

  openCreateModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(
      CreateToolGroupComponent,
    );
    modalRef.result.then(() => this.loadToolGroups(), console.log);
  }

  getToolGroupSuggestions(): void {
    this.hasAlreadyRunTester = true;
    this.loadingSuggestions = true;

    this.toolGroupService
      .getToolGroupSuggestions(
        this.testerCountryRule,
        this.testerLanguageRule,
        this.testerPraxisRule,
      )
      .then((data) => {
        this.suggestedTools = data;
        this.loadingSuggestions = false;
      });
  }

  updateSelected(
    selectedItems: (CountriesType | Language | Praxis)[],
    type: RuleType,
    subType: PraxisType,
  ): void {
    const codes = selectedItems.map((item) => item.code);
    switch (type) {
      case RuleTypeEnum.COUNTRY:
        this.testerSelectedCountries = codes[0];
        this.testerCountryRule.countries = [codes[0]];
        break;
      case RuleTypeEnum.LANGUAGE:
        this.testerSelectedLanguages = codes;
        this.testerLanguageRule.languages = codes;
        break;
      case RuleTypeEnum.PRAXIS:
        switch (subType) {
          case PraxisTypeEnum.CONFIDENCE:
            this.testerSelectedPraxisConfidence = codes[0];
            this.testerPraxisRule.confidence = [codes[0]];
            break;
          case PraxisTypeEnum.OPENNESS:
            this.testerSelectedPraxisOpenness = codes[0];
            this.testerPraxisRule.openness = [codes[0]];
            break;
        }
        break;
    }
  }

  protected handleError(message): void {
    this.errorMessage = message;
  }
}
