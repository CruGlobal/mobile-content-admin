import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {
  CountriesType,
  CountryRule,
  LanguageRule,
  PraxisRule,
  RuleTypeEnum,
  Praxis,
  PraxisTypeEnum,
} from '../../models/tool-group';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { countries } from 'countries-list';
import {
  LanguageBCP47Service,
  LanguageBCP47,
} from '../../service/languages-bcp47-tag.service';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';

type Item =
  | (LanguageBCP47 & CountriesType & Praxis)
  | (CountriesType & Praxis & LanguageBCP47);

@Component({
  selector: 'admin-tool-group-rule-reuseable',
  templateUrl: './tool-group-rule-reuseable.component.html',
})
export class ToolGroupRuleReuseableComponent implements OnInit {
  @Input() rule:
    | (CountryRule & LanguageRule & PraxisRule)
    | (LanguageRule & PraxisRule & CountryRule)
    | (PraxisRule & CountryRule & LanguageRule);
  @Input() ruleType: RuleTypeEnum;
  @Input() praxisType: PraxisTypeEnum;
  @Output() selectedItemsEmit = new EventEmitter<
    (LanguageBCP47 | CountriesType | Praxis)[]
  >();
  @Output() negativeRuleOutput = new EventEmitter<boolean>();
  selectedItems: (LanguageBCP47 | CountriesType | Praxis)[] = [];
  negativeRule = false;
  negativeInputId: number;
  items: (LanguageBCP47 | CountriesType | Praxis)[];
  selectedItem: LanguageBCP47 | CountriesType | Praxis;
  name: string;
  errorMessage: string;

  constructor(
    protected activeModal: NgbActiveModal,
    protected languageBCP47Service: LanguageBCP47Service,
    protected toolGroupService: ToolGroupService,
  ) {}

  ngOnInit(): void {
    this.negativeInputId = Math.floor(Math.random() * 1000);
    this.negativeRule = this.rule['negative-rule'];

    switch (this.ruleType) {
      case RuleTypeEnum.COUNTRY:
        this.name = 'Countries';
        this.items = Object.entries(countries).map((country) => {
          return {
            code: country[0],
            ...country[1],
          } as CountriesType;
        });
        if (this.rule.countries) {
          this.selectedItems = (this.rule.countries.map((countryCode) => {
            return this.items.find((country) => country.code === countryCode);
          }) as unknown) as CountriesType[];
        }
        break;
      case RuleTypeEnum.LANGUAGE:
        this.name = 'Languages';
        this.items = this.languageBCP47Service.getLanguages();
        if (this.rule.languages) {
          this.selectedItems = this.rule.languages.map((langCode) => {
            return this.languageBCP47Service.getLanguage(langCode);
          });
        }
        break;
      case RuleTypeEnum.PRAXIS:
        switch (this.praxisType) {
          case PraxisTypeEnum.CONFIDENCE:
            this.name = 'Confidence';
            this.items = Object.entries(
              this.toolGroupService.praxisConfidentData,
            ).map((praxis) => {
              return {
                code: praxis[0],
                ...praxis[1],
              } as Praxis;
            });
            if (this.rule.confidence) {
              this.selectedItems = this.rule.confidence.map((item) => {
                return this.items.find(
                  (praxis) => praxis.code === item.toString(),
                );
              });
            }
            break;
          case PraxisTypeEnum.OPENNESS:
            this.name = 'Openness';
            this.items = Object.entries(
              this.toolGroupService.praxisOpennessData,
            ).map((praxis) => {
              return {
                code: praxis[0],
                ...praxis[1],
              } as Praxis;
            });
            if (this.rule.openness) {
              this.selectedItems = this.rule.openness.map((item) => {
                return this.items.find(
                  (praxis) => praxis.code === item.toString(),
                );
              });
            }
            break;
        }
        break;
    }
    this.selectedItemsEmit.emit(this.selectedItems);
  }

  handleSelectedItem(event) {
    if (this.selectedItems.find((item) => item.code === event.code)) {
      this.handleError(`Already selected ${this.ruleType}`);
      return;
    }
    this.selectedItems = [...this.selectedItems, event];
    this.selectedItemsEmit.emit(this.selectedItems);
  }

  handleDeleteSelectedItem(selecteditem: Item): void {
    this.selectedItems = (this.selectedItems.filter(
      (item) => item.code !== selecteditem.code,
    ) as unknown) as LanguageBCP47[] | CountriesType[];
    this.selectedItemsEmit.emit(this.selectedItems);
  }

  handleNegativeRuleChange(isNegative) {
    this.negativeRuleOutput.emit(isNegative);
  }

  private handleError(message): void {
    this.errorMessage = message;
  }
}
