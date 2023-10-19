import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICountry } from 'countries-list'
import { Input, Output, EventEmitter } from '@angular/core';
import { ToolGroup, ToolGroupRule, RuleTypeEnum } from '../../models/tool-group';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { LanguageBCP47 } from '../../service/languages-bcp47-tag.service';

export type countriesType = (ICountry & {code: string})

export abstract class AbstractEditToolGroupComponent {
  @Input() toolGroup: ToolGroup = new ToolGroup();
  @Input() selectedCountries: countriesType[] = [];
  @Input() selectedLanguages: LanguageBCP47[] = [];
  @Output() EditedToolGroup: EventEmitter<any> = new EventEmitter();
  saving = false;
  errorMessage: string;
  countryRule: ToolGroupRule;
  languageRule: ToolGroupRule;
  isNewToolGroup = false;

  protected constructor(
    protected toolGroupService: ToolGroupService,
    protected activeModal: NgbActiveModal,
  ) {
    this.countryRule = new ToolGroupRule();
    this.countryRule['tool-group'] = this.toolGroup
    this.languageRule = new ToolGroupRule();
    this.languageRule['tool-group'] = this.toolGroup
  }

  init(): void {
    if (!this.toolGroup.id) this.isNewToolGroup = true;

    if (!this.isNewToolGroup && this.toolGroup['rules-country'].length) {
      this.countryRule = this.toolGroup['rules-country'][0];
    }

    if (!this.isNewToolGroup && this.toolGroup['rules-language'].length) {
      this.languageRule = this.toolGroup['rules-language'][0];
    }
  }

  updateSelected(selectedItems: (countriesType | LanguageBCP47)[], type:RuleTypeEnum): void {
    switch(type) {
      case RuleTypeEnum.COUNTRY:
        this.selectedCountries = selectedItems as countriesType[];
        this.toolGroup['rules-country'][0].countries = this.getCodes(selectedItems);
        break;
      case RuleTypeEnum.LANGUAGE:
        this.selectedLanguages = selectedItems as LanguageBCP47[];
        this.toolGroup['rules-language'][0].languages = this.getCodes(selectedItems);
        break;
    }
  }

  updateNegativeRule(negativeRule: boolean, type:RuleTypeEnum): void {
    switch(type) {
      case RuleTypeEnum.COUNTRY:
        this.countryRule['negative-rule'] = negativeRule;
        this.toolGroup['rules-country'][0]['negative-rule'] = negativeRule;
        break;
      case RuleTypeEnum.LANGUAGE:
        this.languageRule['negative-rule'] = negativeRule;
        ;
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
      .catch(this.handleError.bind(this))
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = message;
  }

  protected getCodes(items: (countriesType | LanguageBCP47)[]): string[] {
    return items.map((item) => item.code);
  }

  protected saveToolGroup(): void {
    this.EditedToolGroup.emit(this.toolGroup);
    this.activeModal.close('closed');
  }
}
