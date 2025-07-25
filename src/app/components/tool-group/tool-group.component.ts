import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import {
  NgbModal,
  NgbModalRef,
  NgbTypeahead,
} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { countries } from 'countries-list';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import {
  ToolGroup,
  ToolGroupRule,
  RuleTypeEnum,
  CountryRule,
  LanguageRule,
  PraxisTypeEnum,
  RuleType,
  PraxisType,
} from '../../models/tool-group';
import { Resource } from '../../models/resource';
import { UpdateToolGroupComponent } from '../edit-tool-group/update-tool-group/update-tool-group.component';
import { ToolGroupsComponent } from '../tool-groups/tool-groups.component';
import { ToolGroupRuleComponent } from '../edit-tool-group-rule/tool-group-rule.component';
import { ToolGroupResourceComponent } from '../edit-tool-group-resource/tool-group-resource.component';

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
  resources: Resource[];
  showDetails = false;
  hasLoadedInitialDetails = false;
  errorMessage: string;

  private _translationLoaded = new Subject<number>();
  translationLoaded$ = this._translationLoaded.asObservable();

  constructor(
    private modalService: NgbModal,
    protected toolGroupService: ToolGroupService,
  ) {}

  ngOnDestroy(): void {
    this._translationLoaded.complete();
  }

  openUpdateModal(): void {
    this.loadAllDetails().then((toolGroup) => {
      const modalRef: NgbModalRef = this.modalService.open(
        UpdateToolGroupComponent,
        { size: 'lg' },
      );
      modalRef.componentInstance.toolGroup = toolGroup;
      modalRef.result.then((result) => {
        this.toolGroupsComponent.loadToolGroups().then(() => {
          if (result !== 'deleted') {
            this.loadAllDetails(true);
          }
        });
      }, console.log);
    });
  }

  openRuleModal(
    rule: (CountryRule & LanguageRule) | (LanguageRule & CountryRule),
    ruleType: RuleType,
  ): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ToolGroupRuleComponent,
      { size: 'lg' },
    );
    modalRef.componentInstance.rule = rule;
    modalRef.componentInstance.ruleType = ruleType;
    modalRef.result.then(async () => {
      this.toolGroup = await this.toolGroupService.getToolGroup(
        this.toolGroup.id,
      );
    });
  }

  createRule(ruleType: RuleType): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ToolGroupRuleComponent,
      { size: 'lg' },
    );

    const newRule = new ToolGroupRule();
    newRule['tool-group'] = this.toolGroup;

    modalRef.componentInstance.rule = newRule;
    modalRef.componentInstance.ruleType = ruleType;
    modalRef.result.then(async () => {
      this.toolGroup = await this.toolGroupService.getToolGroup(
        this.toolGroup.id,
      );
    });
  }

  addResource(): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ToolGroupResourceComponent,
      { size: 'lg' },
    );
    modalRef.componentInstance.resources = this.toolGroupsComponent.resources;
    modalRef.componentInstance.toolGroup = this.toolGroup;
    modalRef.result.then(async () => {
      await this.loadAllDetails(true);
    });
  }

  getReadableValue(code: string, type: RuleType, praxisType: PraxisType): any {
    let value;
    switch (type) {
      case RuleTypeEnum.LANGUAGE:
        value = this.toolGroupsComponent.languages.find(
          (language) => language.code === code,
        ) || { name: code };
        break;
      case RuleTypeEnum.COUNTRY:
        value = countries[code];
        break;
      case RuleTypeEnum.PRAXIS:
        switch (praxisType) {
          case PraxisTypeEnum.CONFIDENCE:
            value = this.toolGroupService.praxisConfidentData[code];
            break;
          case PraxisTypeEnum.OPENNESS:
            value = this.toolGroupService.praxisOpennessData[code];
            break;
        }
        break;
    }
    return value;
  }

  async handleToggleAccordian(): Promise<void> {
    this.showDetails = !this.showDetails;
    await this.loadAllDetails();
  }

  async loadAllDetails(force = false): Promise<ToolGroup> {
    if (!this.hasLoadedInitialDetails || force) {
      this.toolGroup = await this.toolGroupService.getToolGroup(
        this.toolGroup.id,
      );
      this.hasLoadedInitialDetails = true;
      if (this.toolGroup?.tools?.length) {
        this.toolGroup.tools = this.toolGroup.tools.map((tool) => {
          return {
            ...tool,
            suggestionsWeight: tool['suggestions-weight'],
          };
        });
      }
    }
    return this.toolGroup;
  }
}
