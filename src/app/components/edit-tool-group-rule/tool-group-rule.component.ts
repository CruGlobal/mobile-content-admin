import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Language } from '../../models/language';
import {
  CountriesType,
  RulesType,
  Praxis,
  RuleTypeEnum,
  PraxisTypeEnum,
} from '../../models/tool-group';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';

@Component({
  selector: 'admin-tool-group-rule',
  templateUrl: './tool-group-rule.component.html',
})
export class ToolGroupRuleComponent implements OnInit {
  @Input() rule: RulesType;
  @Input() ruleType: RuleTypeEnum;
  @Output() EditedRule: EventEmitter<any> = new EventEmitter();
  saving = false;
  isNewRule = false;
  errorMessage: string;
  ruleData: any;

  constructor(
    protected toolGroupService: ToolGroupService,
    protected activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    if (!this.rule.id) {
      this.isNewRule = true;
    }
    if (this.ruleType === RuleTypeEnum.PRAXIS) {
      this.ruleData = {
        confidence: [],
        openness: [],
      };
    } else {
      this.ruleData = [];
    }
  }

  updateSelected(
    selectedItems: (CountriesType | Language | Praxis)[],
    praxisType: PraxisTypeEnum,
  ): void {
    const codes = selectedItems.map((item) => item.code);
    switch (this.ruleType) {
      case RuleTypeEnum.COUNTRY:
        this.rule.countries = codes;
        this.ruleData = codes;
        break;
      case RuleTypeEnum.LANGUAGE:
        this.rule.languages = codes;
        this.ruleData = codes;
        break;
      case RuleTypeEnum.PRAXIS:
        switch (praxisType) {
          case PraxisTypeEnum.CONFIDENCE:
            this.rule.confidence = codes;
            this.ruleData.confidence = codes;
            break;
          case PraxisTypeEnum.OPENNESS:
            this.rule.openness = codes;
            this.ruleData.openness = codes;
            break;
        }
        break;
    }
  }

  updateNegativeRule(negativeRule: boolean): void {
    this.rule['negative-rule'] = negativeRule;
  }

  createOrUpdateRule(): void {
    this.saving = true;
    this.toolGroupService
      .createOrUpdateRule(
        this.rule['tool-group'].id,
        this.rule.id,
        this.rule['negative-rule'],
        this.ruleData,
        this.ruleType,
      )
      .then(() => this.activeModal.close())
      .catch(this.handleError.bind(this));
  }

  cancel() {
    this.activeModal.dismiss('dismissed');
  }

  deleteRule(): void {
    this.saving = true;
    this.toolGroupService
      .deleteRule(this.rule['tool-group'].id, this.rule.id, this.ruleType)
      .then(() => this.activeModal.close())
      .catch(this.handleError.bind(this));
  }

  protected getCodes(items: (CountriesType | Language)[]): string[] {
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
