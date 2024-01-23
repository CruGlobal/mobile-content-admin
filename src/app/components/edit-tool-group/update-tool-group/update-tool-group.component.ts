import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ToolGroupService } from '../../../service/tool-group/tool-group.service';
import { Language } from '../../../models/language';
import {
  CountriesType,
  ToolGroup,
  ToolGroupRule,
  RuleTypeEnum,
  Praxis,
  PraxisTypeEnum,
} from '../../../models/tool-group';
import { AbstractEditToolGroupComponent } from '../abstract-edit-tool-group.component';

interface PromisePayload {
  success: boolean;
  value?: any;
  error: string;
}
interface HasMadeChangesProps {
  codes: string[];
  type: RuleTypeEnum;
  praxisType?: PraxisTypeEnum ;
}

@Component({
  selector: 'admin-edit-tool-group',
  templateUrl: '../edit-tool-group.component.html',
})
export class UpdateToolGroupComponent
  extends AbstractEditToolGroupComponent
  implements OnInit {
  @Input() toolGroup: ToolGroup;
  @Input() selectedCountries: CountriesType[] = [];
  @Input() selectedLanguages: Language[] = [];
  @Input() selectedPraxisConfidence: Praxis[] = [];
  @Input() selectedPraxisOpenness: Praxis[] = [];
  initialToolGroup: ToolGroup;
  countryRule: ToolGroupRule;
  languageRule: ToolGroupRule;
  praxisRule: ToolGroupRule;

  constructor(toolGroupService: ToolGroupService, activeModal: NgbActiveModal) {
    super(toolGroupService, activeModal);
  }

  ngOnInit(): void {
    this.toolGroup.suggestedWeight = this.toolGroup['suggestions-weight'];
    this.initialToolGroup = _.cloneDeep(this.toolGroup);
    super.init();
  }

  isEqual = (array1: string[], array2: string[]): boolean => {
    const array2Sorted = array2.slice().sort();
    return (
      array1.length === array2.length &&
      array1
        .slice()
        .sort()
        .every(
          (value, index) =>
            value.toString().toLowerCase() ===
            array2Sorted[index].toString().toLowerCase(),
        )
    );
  };

  getValues(type: RuleTypeEnum, praxisType?: PraxisTypeEnum) {
    switch (type) {
      case RuleTypeEnum.COUNTRY:
        const initialCountry =
          this.initialToolGroup['rules-country'][0] || undefined;
        const initialCountryToolgroup = initialCountry ? initialCountry : new ToolGroupRule();
        return {
          initialRule: initialCountry,
          initialCodes: initialCountryToolgroup.countries || [],
          initialNegativeRule: initialCountryToolgroup['negative-rule'] || false,
          negativeRule: this.countryRule['negative-rule'],
        };
      case RuleTypeEnum.LANGUAGE:
        const initialLanguage =
          this.initialToolGroup['rules-language'][0] || undefined;
        const initialLanguageToolgroup = initialLanguage ? initialLanguage : new ToolGroupRule();
        return {
          initialRule: initialLanguage,
          initialCodes: initialLanguageToolgroup.languages || [],
          initialNegativeRule: initialLanguageToolgroup['negative-rule'] || false,
          negativeRule: this.languageRule['negative-rule'],
        };
      case RuleTypeEnum.PRAXIS:
        const initialPraxis =
          this.initialToolGroup['rules-praxis'][0] || undefined;
        const initialPraxisToolgroup = initialPraxis ? initialPraxis : new ToolGroupRule();
        if (praxisType === PraxisTypeEnum.CONFIDENCE) {
          return {
            initialRule: initialPraxis,
            initialCodes: initialPraxisToolgroup.confidence || [],
            initialNegativeRule: initialPraxisToolgroup['negative-rule'] || false,
            negativeRule: this.praxisRule['negative-rule'],
          };
        } else {
          return {
            initialRule: initialPraxis,
            initialCodes: initialPraxisToolgroup.openness || [],
            initialNegativeRule: initialPraxisToolgroup['negative-rule'] || false,
            negativeRule: this.praxisRule['negative-rule'],
          };
        }
    }
  }

  hasMadeChanges(dataToCheck: HasMadeChangesProps[]): boolean {
    const results = dataToCheck.map((data) => {
      const {codes, type, praxisType} = data;
      const values = this.getValues(type, praxisType);

      if (!values.initialRule && (codes.length || values.negativeRule)) {
        return true;
      } else if (values.initialRule) {
        const codeChanges = !this.isEqual(values.initialCodes, codes);
        const negativeChanges =
          values.initialNegativeRule !== values.negativeRule;
        if (codeChanges || negativeChanges) {
          return true;
        }
      }
      return false
    })
    return !!results.find(result => result)
  }

  async saveToolGroup(): Promise<void> {
    this.saving = true;
    const promises = [];
    try {
      if (
        this.initialToolGroup.name !== this.toolGroup.name ||
        this.initialToolGroup.suggestedWeight !== this.toolGroup.suggestedWeight
      ) {
        promises.push(
          this.toolGroupService.createOrUpdateToolGroup(this.toolGroup, true),
        );
      }

      const countryCodes = super.getCodes(this.selectedCountries);
      const countryHasMadeChanges = [
        {
          codes: countryCodes,
          type: RuleTypeEnum.COUNTRY
        }
      ]
      if (this.hasMadeChanges(countryHasMadeChanges)) {
        promises.push(
          this.toolGroupService.createOrUpdateRule(
            this.toolGroup.id,
            this.countryRule.id,
            this.countryRule['negative-rule'],
            countryCodes,
            RuleTypeEnum.COUNTRY,
          ),
        );
      }

      const languageCodes = super.getCodes(this.selectedLanguages);
      const languageHasMadeChanges = [
        {
          codes: languageCodes,
          type: RuleTypeEnum.LANGUAGE
        }
      ]
      if (this.hasMadeChanges(languageHasMadeChanges)) {
        promises.push(
          this.toolGroupService.createOrUpdateRule(
            this.toolGroup.id,
            this.languageRule.id,
            this.languageRule['negative-rule'],
            languageCodes,
            RuleTypeEnum.LANGUAGE,
          ),
        );
      }

      const praxisConfidenceCodes = super.getCodes(
        this.selectedPraxisConfidence,
      );
      const praxisOpennessCodes = super.getCodes(this.selectedPraxisOpenness);
      // hasMadeChanges take the openness codes and then knows to grab the confidence codes
      // As it is of the RuleTypeEnum "PRAXIS"
      const praxisHasMadeChanges = [
        {
          codes: praxisOpennessCodes,
          type: RuleTypeEnum.PRAXIS,
          praxisType: PraxisTypeEnum.OPENNESS
        },
        {
          codes: praxisConfidenceCodes,
          type: RuleTypeEnum.PRAXIS,
          praxisType: PraxisTypeEnum.CONFIDENCE
        }
      ]
      if (this.hasMadeChanges(praxisHasMadeChanges)) {
        promises.push(
          this.toolGroupService.createOrUpdateRule(
            this.toolGroup.id,
            this.praxisRule.id,
            this.praxisRule['negative-rule'],
            {
              confidence: praxisConfidenceCodes,
              openness: praxisOpennessCodes,
            },
            RuleTypeEnum.PRAXIS,
          ),
        );
      }

      const results: PromisePayload[] = await Promise.all(
        promises.map((p) =>
          p
            .then((value) => ({
              success: true,
              value,
            }))
            .catch((error) => ({
              success: false,
              error,
            })),
        ),
      );
      const invalidResults = results.filter((result) => !result.success);
      if (invalidResults.length) {
        throw new Error(invalidResults.join('. '));
      } else {
        super.saveToolGroup();
      }
    } catch (error) {
      super.handleError(error);
    }
  }
}
