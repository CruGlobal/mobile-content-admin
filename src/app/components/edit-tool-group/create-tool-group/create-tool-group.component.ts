import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { ToolGroupService, createRuleTypeEnum } from '../../../service/tool-group/tool-group.service';
import { LanguageBCP47Service, LanguageBCP47 } from '../../../service/languages-bcp47-tag.service';
import { ToolGroup } from '../../../models/tool-group';
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
    languageBCP47Service: LanguageBCP47Service,
  ) {
    super(toolGroupService, activeModal, languageBCP47Service);
  }

  ngOnInit(): void {
    super.init();
  }

  async saveToolGroup(): Promise<void> {
    this.saving = true;
    try {
      const toolGroup = await this.toolGroupService.createToolGroup(this.toolGroup);
      if (this.selectedCountries.length) {
        this.toolGroupService.createRule(toolGroup.id, false, this.selectedCountries, createRuleTypeEnum.COUNTRY);
      }
      if (this.selectedLanguages.length) {
        this.toolGroupService.createRule(toolGroup.id, false, this.selectedLanguages, createRuleTypeEnum.LANGUAGE);
      }
    }
    catch(error) {
      super.handleError(error)
    }
  }
}
