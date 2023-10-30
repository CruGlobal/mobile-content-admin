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
        const initialcountry =
          this.initialToolGroup['rules-country'][0] || undefined;
        return {
          initialRule: initialcountry,
          initialCodes: initialcountry.countries || [],
          initialNegativeRule: initialcountry['negative-rule'],
          negativeRule: this.countryRule['negative-rule'],
        };
      case RuleTypeEnum.LANGUAGE:
        const initialLanguage =
          this.initialToolGroup['rules-language'][0] || undefined;
        return {
          initialRule: initialLanguage,
          initialCodes: initialLanguage.languages || [],
          initialNegativeRule: initialLanguage['negative-rule'],
          negativeRule: this.languageRule['negative-rule'],
        };
      case RuleTypeEnum.PRAXIS:
        const initialPraxis =
          this.initialToolGroup['rules-praxis'][0] || undefined;
        if (praxisType === PraxisTypeEnum.CONFIDENCE) {
          return {
            initialRule: initialPraxis,
            initialCodes: initialPraxis.confidence,
            initialNegativeRule: initialPraxis['negative-rule'],
            negativeRule: this.praxisRule['negative-rule'],
          };
        } else {
          return {
            initialRule: initialPraxis,
            initialCodes: initialPraxis.openness,
            initialNegativeRule: initialPraxis['negative-rule'],
            negativeRule: this.praxisRule['negative-rule'],
          };
        }
    }
  }

  hasMadeChanges(codes: string[], type: RuleTypeEnum): boolean {
    const values = this.getValues(type);

    if (!values.initialRule && (codes || values.negativeRule)) {
      return true;
    } else if (values.initialRule) {
      const codeChanges = !this.isEqual(values.initialCodes, codes);
      const negativeChanges =
        values.initialNegativeRule !== values.negativeRule;
      if (codeChanges || negativeChanges) {
        return true;
      }
      if (type === RuleTypeEnum.PRAXIS) {
        // Test confidence
        const confidenceValues = this.getValues(
          type,
          PraxisTypeEnum.CONFIDENCE,
        );
        const confidenceCodeChanges = !this.isEqual(
          confidenceValues.initialCodes,
          super.getCodes(this.selectedPraxisConfidence),
        );
        if (confidenceCodeChanges) {
          return true;
        }
      }
    }
    return false;
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
      if (this.hasMadeChanges(countryCodes, RuleTypeEnum.COUNTRY)) {
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
      if (this.hasMadeChanges(languageCodes, RuleTypeEnum.LANGUAGE)) {
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
      if (this.hasMadeChanges(praxisOpennessCodes, RuleTypeEnum.PRAXIS)) {
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
