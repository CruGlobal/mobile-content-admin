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
import { ToolGroup, ToolGroupRule, RuleTypeEnum, CountryRule, LanguageRule } from '../../models/tool-group';
import { UpdateToolGroupComponent } from '../edit-tool-group/update-tool-group/update-resource.component';
import { ToolGroupsComponent } from '../tool-groups/tool-groups.component';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { LanguageBCP47Service, LanguageBCP47 } from '../../service/languages-bcp47-tag.service';
import { ToolGroupRuleComponent } from '../edit-tool-group-rule/tool-group-rule.component';
import { countries } from 'countries-list'

@Component({
  selector: 'admin-tool-group',
  templateUrl: './tool-group.component.html',
})
export class ToolGroupComponent implements OnInit, OnDestroy {
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

  ngOnInit(): void {
    console.log('toolGrouptoolGroup', this.toolGroup);
  }

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
      modalRef.componentInstance.EditedToolGroup.subscribe((data) => {
        this.toolGroup = data
      });
      modalRef.result.then(
        () => this.toolGroupsComponent.loadToolGroups(),
        console.log,
      );
    })
  }

  openRuleModal(
    rule: CountryRule & LanguageRule | LanguageRule & CountryRule,
    ruleType: RuleTypeEnum
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

  getReadableValue(code: string, type: RuleTypeEnum): LanguageBCP47 {
    if (type === RuleTypeEnum.LANGUAGE) {
      return this.languageBCP47Service.getLanguage(code);
    }
    if (type === RuleTypeEnum.COUNTRY) {
      return countries[code]
    }
  }


  async handleToggleAccordian(): Promise<void> {
    this.showDetails = !this.showDetails;
    await this.loadAllDetails();
  }

  async loadAllDetails(): Promise<ToolGroup> {
    if (!this.hasLoadedInitialDetails) {
      this.toolGroup = await this.toolGroupService.getToolGroup(this.toolGroup.id);
      this.hasLoadedInitialDetails = true;
    }
    return this.toolGroup
  }

  private handleError(message): void {
    this.errorMessage = message;
  }
}
