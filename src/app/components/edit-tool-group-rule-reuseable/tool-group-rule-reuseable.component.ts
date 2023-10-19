import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { CountryRule, LanguageRule, RuleTypeEnum } from '../../models/tool-group';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { countries, ICountry } from 'countries-list'
import { LanguageBCP47Service, LanguageBCP47 } from '../../service/languages-bcp47-tag.service';

export type countriesType = (ICountry & {code: string})
type Item = LanguageBCP47 & countriesType | countriesType & LanguageBCP47

@Component({
  selector: 'admin-tool-group-rule-reuseable',
  templateUrl: './tool-group-rule-reuseable.component.html',
})
export class ToolGroupRuleReuseableComponent implements OnInit {
  @Input() rule: CountryRule & LanguageRule | LanguageRule & CountryRule;
  @Input() ruleType: RuleTypeEnum;
  @Output() selectedItemsEmit = new EventEmitter<(LanguageBCP47|countriesType)[]>();
  @Output() negativeRuleOutput = new EventEmitter<boolean>();
  selectedItems: (LanguageBCP47|countriesType)[] = [];
  negativeRule: boolean = false;
  negativeInputId: number;
  items: (LanguageBCP47|countriesType)[];
  selectedItem: LanguageBCP47 | countriesType;
  name: string;
  errorMessage: string;

  constructor(
    protected activeModal: NgbActiveModal,
    protected languageBCP47Service: LanguageBCP47Service,
  ) { }

  ngOnInit(): void {
    this.negativeInputId = Math.floor(Math.random() * 50)
    this.negativeRule = this.rule['negative-rule'];

    switch(this.ruleType) {
      case RuleTypeEnum.COUNTRY:
        this.items = Object.entries(countries).map(country => {
          return {
            code: country[0],
            ...country[1]
          } as countriesType
        })
        if (this.rule.countries) {
          this.selectedItems = this.rule.countries.map(countryCode => {
            return this.items.find(country => country.code === countryCode);
          }) as unknown as countriesType[];
        }
        this.name = 'Countries';
        break;
      case RuleTypeEnum.LANGUAGE:
          this.items = this.languageBCP47Service.getLanguages()
          if (this.rule.languages) {
            this.selectedItems = this.rule.languages.map(langCode => {
              return this.languageBCP47Service.getLanguage(langCode);
            })
          }
          this.name = 'Languages';
        break;
    }
    this.selectedItemsEmit.emit(this.selectedItems);
  }

  handleSelectedItem(event) {
    if (this.selectedItems.find(item => item.code === event.code)) {
      this.handleError('Already selected Language')
      return
    };
    this.selectedItems = [...this.selectedItems, event]
    this.selectedItemsEmit.emit(this.selectedItems);
  }

  handleDeleteSelectedItem(item: Item): void {
    this.selectedItems = this.selectedItems.filter((lang) => lang.code !== item.code) as unknown as LanguageBCP47[] | countriesType[];
    this.selectedItemsEmit.emit(this.selectedItems);
  }

  handleNegativeRuleChange(isNegative) {
    this.negativeRuleOutput.emit(isNegative)
  }

  private handleError(message): void {
    this.errorMessage = message;
  }
}
