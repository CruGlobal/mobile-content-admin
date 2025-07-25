import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { Resource } from '../../models/resource';
import { Tools, ToolGroup } from '../../models/tool-group';
import { ResourceService } from '../../service/resource/resource.service';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';

interface PromisePayload {
  success: boolean;
  value?: any;
  error: string;
}

@Component({
  selector: 'admin-tool-group-resource',
  templateUrl: './tool-group-resource.component.html',
})
export class ToolGroupResourceComponent implements OnInit {
  @Input() toolGroup: ToolGroup;
  @Input() resources: Resource[] = [];
  selectedResources: Resource[] = [];
  initialTools: Tools[];
  tools: Tools[];
  saving = false;
  errorMessage: string[] = [];
  ruleData: any;

  constructor(
    protected toolGroupService: ToolGroupService,
    protected activeModal: NgbActiveModal,
    protected resourceService: ResourceService,
  ) {}

  ngOnInit(): void {
    this.initialTools = this.toolGroup.tools;
    if (this.initialTools.length) {
      this.tools = this.initialTools;
    } else {
      this.tools = [this.generateNewResource()];
    }

    if (!this.resources.length) {
      this.resourceService
        .getResources()
        .then((resources) => {
          this.resources = resources;
        })
        .catch(this.handleError.bind(this));
    }
  }

  async createOrUpdate(): Promise<void> {
    this.saving = true;
    this.errorMessage = [];
    const dataErrors = [];
    const promises = [];
    if (this.tools.length) {
      this.tools.forEach((tool) => {
        const isUpdate = !!this.initialTools.find(
          (item) => item.id === tool.id,
        );
        if (!tool.suggestionsWeight || tool.suggestionsWeight === '0') {
          dataErrors.push(
            `${tool.tool.name} needs to have a Suggestions Weight larger than 0.`,
          );
        }
        promises.push(
          this.toolGroupService.addOrUpdateTool(
            this.toolGroup.id,
            tool.id,
            tool.tool.id.toString(),
            tool.suggestionsWeight,
            isUpdate,
          ),
        );
      });
    }

    if (dataErrors.length) {
      this.saving = false;
      this.errorMessage = dataErrors;
      return;
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
      this.saving = false;
      invalidResults.forEach((invalidResult) => {
        this.errorMessage = [...this.errorMessage, invalidResult.error];
      });
    } else {
      this.activeModal.close('closed');
    }
  }

  updateTool(event: Tools): void {
    const toolIndex = this.tools.findIndex((tool) => tool.id === event.id);
    const tools = this.tools;
    tools[toolIndex] = event;
    this.tools = tools;
  }

  deleteTool(event): void {
    this.tools = this.tools.filter((tool) => tool.id !== event);
    // If ID requested to be deleted an existing tool
    const shouldDelete = !!this.initialTools.find((item) => item.id === event);
    if (shouldDelete) {
      this.toolGroupService.deleteTool(this.toolGroup.id, event);
    }
  }

  addResource(): void {
    this.tools = [...this.tools, this.generateNewResource()];
  }

  generateNewResource(): Tools {
    return {
      id: this.generateId(),
      suggestionsWeight: '',
      tool: undefined,
      'tool-group': this.toolGroup,
    };
  }

  generateId(): string {
    return UUID.UUID();
  }

  cancel() {
    this.activeModal.dismiss('dismissed');
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = [message];
  }
}
