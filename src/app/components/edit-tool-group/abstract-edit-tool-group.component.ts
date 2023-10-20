import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICountry } from 'countries-list'
import { Input, Output, EventEmitter } from '@angular/core';
import { ToolGroup, ToolGroupRule, Praxis, RuleTypeEnum, PraxisTypeEnum } from '../../models/tool-group';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { LanguageBCP47 } from '../../service/languages-bcp47-tag.service';

export type countriesType = (ICountry & {code: string})

export abstract class AbstractEditToolGroupComponent {
  @Input() toolGroup: ToolGroup = new ToolGroup();
  @Input() selectedCountries: countriesType[] = [];
  @Input() selectedLanguages: LanguageBCP47[] = [];
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
    this.countryRule['tool-group'] = this.toolGroup
    this.languageRule = new ToolGroupRule();
    this.languageRule['tool-group'] = this.toolGroup
    this.praxisRule = new ToolGroupRule();
    this.praxisRule['tool-group'] = this.toolGroup
  }

  init(): void {
    if (!this.toolGroup.id) this.isNewToolGroup = true;

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

  updateSelected(selectedItems: (countriesType|LanguageBCP47|Praxis)[], type:RuleTypeEnum, subType:PraxisTypeEnum): void {
    switch(type) {
      case RuleTypeEnum.COUNTRY:
        this.selectedCountries = selectedItems as countriesType[];
        this.toolGroup['rules-country']
        break;
      case RuleTypeEnum.LANGUAGE:
        this.selectedLanguages = selectedItems as LanguageBCP47[];
        break;
      case RuleTypeEnum.PRAXIS:
        switch(subType) {
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

  updateNegativeRule(negativeRule: boolean, type:RuleTypeEnum): void {
    switch(type) {
      case RuleTypeEnum.COUNTRY:
        this.countryRule['negative-rule'] = negativeRule;
        break;
      case RuleTypeEnum.LANGUAGE:
        this.languageRule['negative-rule'] = negativeRule;
        break;
      // Praxis does not have negative rule.
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
      .catch(this.handleError.bind(this))
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = message;
  }

  protected getCodes(items: (countriesType|LanguageBCP47|Praxis)[]): string[] {
    return items.map((item) => item.code);
  }

  protected saveToolGroup(): void {
    this.activeModal.close('closed');
  }
}
