import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  NgbModal,
  NgbModalRef,
  NgbTypeahead,
} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ToolGroup, ToolGroupRule, RuleTypeEnum, CountryRule, LanguageRule, PraxisTypeEnum } from '../../models/tool-group';
import { UpdateToolGroupComponent } from '../edit-tool-group/update-tool-group/update-resource.component';
import { ToolGroupsComponent } from '../tool-groups/tool-groups.component';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { LanguageBCP47Service } from '../../service/languages-bcp47-tag.service';
import { ToolGroupRuleComponent } from '../edit-tool-group-rule/tool-group-rule.component';
import { countries } from 'countries-list'

@Component({
  selector: 'admin-tool-group',
  templateUrl: './tool-group.component.html',
})
export class ToolGroupComponent implements OnDestroy {
  @Input() toolGroup: ToolGroup;
  @Input() toolGroupsComponent: ToolGroupsComponent;

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  showDetails = false;
  hasLoadedInitialDetails = false
  errorMessage: string;
  languages: string[][] = []

  private _translationLoaded = new Subject<number>();
  translationLoaded$ = this._translationLoaded.asObservable();

  constructor(
    private modalService: NgbModal,
    private languageBCP47Service: LanguageBCP47Service,
    protected toolGroupService: ToolGroupService,
  ) {}

  ngOnDestroy(): void {
    this._translationLoaded.complete();
  }

  openUpdateModal(): void {
    this.loadAllDetails().then(toolGroup => {
      const modalRef: NgbModalRef = this.modalService.open(
        UpdateToolGroupComponent,
        { size: 'lg' },
      );
      modalRef.componentInstance.toolGroup = toolGroup;
      modalRef.result.then(() => {
          this.toolGroupsComponent.loadToolGroups().then(() => {
            this.loadAllDetails(true)
          })
        },
        console.log,
      );
    })
  }

  openRuleModal(
    rule: CountryRule & LanguageRule | LanguageRule & CountryRule,
    ruleType: RuleTypeEnum,
  ): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ToolGroupRuleComponent,
      { size: 'lg' },
    );
    modalRef.componentInstance.rule = rule;
    modalRef.componentInstance.ruleType = ruleType;
    modalRef.result.then(async () => {
      this.toolGroup = await this.toolGroupService.getToolGroup(this.toolGroup.id);
    });
  }

  createRule(ruleType: RuleTypeEnum): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ToolGroupRuleComponent,
      { size: 'lg' },
    );

    const newRule = new ToolGroupRule();
    newRule['tool-group'] = this.toolGroup;

    modalRef.componentInstance.rule = newRule;
    modalRef.componentInstance.ruleType = ruleType;
    modalRef.result.then(async () => {
      this.toolGroup = await this.toolGroupService.getToolGroup(this.toolGroup.id);
    });
  }

  getReadableValue(code: string, type: RuleTypeEnum, praxisType: PraxisTypeEnum): any {
    let value
    switch(type) {
      case RuleTypeEnum.LANGUAGE:
        value = this.languageBCP47Service.getLanguage(code);
        break;
      case RuleTypeEnum.COUNTRY:
        value = countries[code];
        break;
      case RuleTypeEnum.PRAXIS:
        switch(praxisType) {
          case PraxisTypeEnum.CONFIDENCE:
            value = this.toolGroupService.praxisConfidentData[code]
            break;
          case PraxisTypeEnum.OPENNESS:
            value = this.toolGroupService.praxisOpennessData[code]
            break;
        }
        break;
    }
    return value
  }


  async handleToggleAccordian(): Promise<void> {
    this.showDetails = !this.showDetails;
    await this.loadAllDetails();
  }

  async loadAllDetails(force = false): Promise<ToolGroup> {
    if (!this.hasLoadedInitialDetails || force) {
      this.toolGroup = await this.toolGroupService.getToolGroup(this.toolGroup.id);
      this.hasLoadedInitialDetails = true;
    }
    return this.toolGroup
  }

  private handleError(message): void {
    this.errorMessage = message;
  }
}
