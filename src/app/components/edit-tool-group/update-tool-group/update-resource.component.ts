import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToolGroupService } from '../../../service/tool-group/tool-group.service';
import { AbstractEditToolGroupComponent } from '../abstract-edit-tool-group.component';
import { ToolGroup, ToolGroupRule, RuleTypeEnum } from '../../../models/tool-group';
import { LanguageBCP47 } from '../../../service/languages-bcp47-tag.service';
import { countriesType } from '../abstract-edit-tool-group.component';

@Component({
  selector: 'admin-edit-tool-group',
  templateUrl: '../edit-tool-group.component.html',
})
export class UpdateToolGroupComponent
  extends AbstractEditToolGroupComponent
  implements OnInit {
  @Input() toolGroup: ToolGroup;
  @Input() selectedCountries: countriesType[] = [];
  @Input() selectedLanguages: LanguageBCP47[] = [];
  countryRule: ToolGroupRule;
  languageRule: ToolGroupRule;

  constructor(
    toolGroupService: ToolGroupService,
    activeModal: NgbActiveModal,
  ) {
    super(toolGroupService, activeModal);
  }

  ngOnInit(): void {
    this.toolGroup.suggestedWeight = this.toolGroup['suggestions-weight'];
    super.init();
  }

  isEqual = (array1: string[], array2: string[]): boolean => {
    const array2Sorted = array2.slice().sort();
    return array1.length === array2.length && array1.slice().sort().every((value, index) => value === array2Sorted[index]);
  }

  async saveToolGroup(): Promise<void> {
    this.saving = true;
    try {
      const countryCodes = super.getCodes(this.selectedCountries);
      const hasCountriesChanges = !this.isEqual(this.countryRule.countries, countryCodes);
      const languageCodes = super.getCodes(this.selectedLanguages);
      const hasLanguagesChanges = !this.isEqual(this.languageRule.languages, languageCodes);
      const promises = []

      if (hasCountriesChanges) {
        promises.push(this.toolGroupService.createOrUpdateRule(
          this.toolGroup.id,
          this.countryRule.id,
          this.countryRule['negative-rule'],
          countryCodes,
          RuleTypeEnum.COUNTRY,
        ));
      }
      if (hasLanguagesChanges) {
        promises.push(this.toolGroupService.createOrUpdateRule(
          this.toolGroup.id,
          this.languageRule.id,
          this.languageRule['negative-rule'],
          languageCodes,
          RuleTypeEnum.LANGUAGE
        ));
      }

      Promise.all([promises])
      .then(() => {
        super.saveToolGroup();
      })
      .catch((error) => super.handleError(error));
    }
    catch(error) {
      super.handleError(error)
    }
  }
}
