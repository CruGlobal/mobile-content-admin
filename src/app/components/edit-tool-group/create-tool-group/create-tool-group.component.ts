import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { ToolGroupService } from '../../../service/tool-group/tool-group.service';
import { LanguageBCP47 } from '../../../service/languages-bcp47-tag.service';
import { ToolGroup, RuleTypeEnum } from '../../../models/tool-group';
import { AbstractEditToolGroupComponent } from '../abstract-edit-tool-group.component';
import { countriesType } from '../abstract-edit-tool-group.component';

@Component({
  selector: 'admin-create-tool-group',
  templateUrl: '../edit-tool-group.component.html',
})
export class CreateToolGroupComponent
  extends AbstractEditToolGroupComponent
  implements OnInit {
  @Input() toolGroup: ToolGroup = new ToolGroup();
  @Input() selectedCountries: countriesType[] = [];
  @Input() selectedLanguages: LanguageBCP47[] = [];

  constructor(
    toolGroupService: ToolGroupService,
    activeModal: NgbActiveModal,
  ) {
    super(toolGroupService, activeModal);
  }

  ngOnInit(): void {
    super.init();
  }

  async saveToolGroup(): Promise<void> {
    this.saving = true;
    try {
      const toolGroup = await this.toolGroupService.createToolGroup(this.toolGroup);
      if (this.selectedCountries.length) {
        const data = super.getCodes(this.selectedCountries);
        this.toolGroupService.createOrUpdateRule(toolGroup.id, null, this.countryRule['negative-rule'], data, RuleTypeEnum.COUNTRY);
      }
      if (this.selectedLanguages.length) {
        const data = super.getCodes(this.selectedLanguages);
        this.toolGroupService.createOrUpdateRule(toolGroup.id, null, this.languageRule['negative-rule'], data, RuleTypeEnum.LANGUAGE);
      }
    }
    catch(error) {
      super.handleError(error)
    }
  }
}
