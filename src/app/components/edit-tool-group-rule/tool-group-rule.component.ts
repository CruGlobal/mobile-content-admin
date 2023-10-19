import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICountry } from 'countries-list'
import { CountryRule, LanguageRule, RuleTypeEnum } from '../../models/tool-group';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { LanguageBCP47 } from '../../service/languages-bcp47-tag.service';

export type countriesType = (ICountry & {code: string})

@Component({
  selector: 'admin-tool-group-rule',
  templateUrl: './tool-group-rule.component.html',
})
export class ToolGroupRuleComponent implements OnInit {
  @Input() rule: CountryRule & LanguageRule | LanguageRule & CountryRule;
  @Input() ruleType: RuleTypeEnum;
  @Output() EditedRule: EventEmitter<any> = new EventEmitter();
  saving = false;
  isNewRule = false;
  errorMessage: string;
  ruleData: string[]

  constructor(
    protected toolGroupService: ToolGroupService,
    protected activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    if (!this.rule.id) {
      this.isNewRule = true
    }
  }

  updateSelected(selectedItems: (countriesType | LanguageBCP47)[]): void {
    const codes = selectedItems.map((item) => item.code)
    this.ruleData = codes;

    switch(this.ruleType) {
      case RuleTypeEnum.COUNTRY:
        this.rule.countries = codes
      break;
      case RuleTypeEnum.LANGUAGE:
        this.rule.languages = codes
      break;
      case RuleTypeEnum.PRAXIS:
        // TODO
      break;
    }

  }

  updateNegativeRule(negativeRule: boolean): void {
    console.log('negativeRule', negativeRule)
    this.rule['negative-rule'] = negativeRule
  }

  createOrUpdateRule(): void {
    this.saving = true;
    this.toolGroupService
      .createOrUpdateRule(
        this.rule['tool-group'].id,
        this.rule.id,
        this.rule['negative-rule'],
        this.ruleData,
        this.ruleType
      )
      .then(() => this.activeModal.close())
      .catch(this.handleError.bind(this))
  }

  cancel() {
    this.activeModal.dismiss('dismissed');
  }

  deleteRule(): void {
    this.saving = true;
    this.toolGroupService
      .deleteRule(this.rule['tool-group'].id, this.rule.id, this.ruleType)
      .then(() => this.activeModal.close())
      .catch(this.handleError.bind(this))
  }

  protected getCodes(items: (countriesType | LanguageBCP47)[]): string[] {
    return items.map((item) => item.code);
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = message;
  }

  protected saveToolGroup(): void {
    this.EditedRule.emit(this.rule);
    this.activeModal.close('closed');
  }
}
