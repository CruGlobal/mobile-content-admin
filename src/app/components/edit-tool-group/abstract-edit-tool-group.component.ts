import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Input, Output, EventEmitter } from '@angular/core';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { Language } from '../../models/language';
import {
  CountriesType,
  ToolGroup,
  ToolGroupRule,
  Praxis,
  RuleTypeEnum,
  PraxisTypeEnum,
  RuleType,
  PraxisType,
} from '../../models/tool-group';

export abstract class AbstractEditToolGroupComponent {
  @Input() toolGroup: ToolGroup = new ToolGroup();
  @Input() selectedCountries: CountriesType[] = [];
  @Input() selectedLanguages: Language[] = [];
  @Input() selectedPraxisConfidence: Praxis[] = [];
  @Input() selectedPraxisOpenness: Praxis[] = [];
  @Output() EditedToolGroup: EventEmitter<any> = new EventEmitter();
  saving = false;
  errorMessage: string;
  countryRule: ToolGroupRule;
  languageRule: ToolGroupRule;
  praxisRule: ToolGroupRule;
  isNewToolGroup = false;

  protected constructor(
    protected toolGroupService: ToolGroupService,
    protected activeModal: NgbActiveModal,
  ) {
    this.countryRule = new ToolGroupRule();
    this.countryRule['tool-group'] = this.toolGroup;
    this.languageRule = new ToolGroupRule();
    this.languageRule['tool-group'] = this.toolGroup;
    this.praxisRule = new ToolGroupRule();
    this.praxisRule['tool-group'] = this.toolGroup;
  }

  init(): void {
    if (!this.toolGroup.id) {
      this.isNewToolGroup = true;
    }

    if (!this.isNewToolGroup && this.toolGroup['rules-country'].length) {
      this.countryRule = this.toolGroup['rules-country'][0];
    }

    if (!this.isNewToolGroup && this.toolGroup['rules-language'].length) {
      this.languageRule = this.toolGroup['rules-language'][0];
    }

    if (!this.isNewToolGroup && this.toolGroup['rules-praxis'].length) {
      this.praxisRule = this.toolGroup['rules-praxis'][0];
    }
  }

  updateSelected(
    selectedItems: (CountriesType | Language | Praxis)[],
    type: RuleType,
    subType: PraxisType,
  ): void {
    switch (type) {
      case RuleTypeEnum.COUNTRY:
        this.selectedCountries = selectedItems as CountriesType[];
        break;
      case RuleTypeEnum.LANGUAGE:
        this.selectedLanguages = selectedItems as Language[];
        break;
      case RuleTypeEnum.PRAXIS:
        switch (subType) {
          case PraxisTypeEnum.CONFIDENCE:
            this.selectedPraxisConfidence = selectedItems as Praxis[];
            break;
          case PraxisTypeEnum.OPENNESS:
            this.selectedPraxisOpenness = selectedItems as Praxis[];
            break;
        }
        break;
    }
  }

  updateNegativeRule(negativeRule: boolean, type: RuleType): void {
    switch (type) {
      case RuleTypeEnum.COUNTRY:
        this.countryRule['negative-rule'] = negativeRule;
        break;
      case RuleTypeEnum.LANGUAGE:
        this.languageRule['negative-rule'] = negativeRule;
        break;
      case RuleTypeEnum.PRAXIS:
        this.praxisRule['negative-rule'] = negativeRule;
        break;
    }
  }

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  deleteToolGroup(): void {
    this.saving = true;
    this.toolGroupService
      .deleteToolGroup(this.toolGroup.id)
      .then(() => this.activeModal.close())
      .catch(this.handleError.bind(this));
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = message;
  }

  protected getCodes(items: (CountriesType | Language | Praxis)[]): string[] {
    return items.map((item) => item.code);
  }

  protected saveToolGroup(): void {
    this.activeModal.close('closed');
  }
}
