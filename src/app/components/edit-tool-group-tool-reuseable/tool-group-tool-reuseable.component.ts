import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Resource } from '../../models/resource';
import { Tools } from '../../models/tool-group';

@Component({
  selector: 'admin-tool-group-tool-reuseable',
  templateUrl: './tool-group-tool-reuseable.component.html',
})
export class ToolGroupToolReuseableComponent implements OnInit, OnChanges {
  @Input() tool: Tools;
  @Input() resources: Resource[];
  @Output() updatedToolEmit = new EventEmitter<Tools>();
  @Output() deleteTool = new EventEmitter<string>();

  selectedResource: Resource;
  suggestionsWeight: string;
  errorMessage: string;
  suggestionsWeightInputId: number;

  constructor(protected activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.suggestionsWeight = this.tool.suggestionsWeight || '';
    this.suggestionsWeightInputId = Math.floor(Math.random() * 50);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resources.currentValue !== changes.resources.previousValue) {
      if (this.tool.tool) {
        this.selectedResource =
          changes.resources.currentValue.find(
            (resource) => resource.id === this.tool.tool.id,
          ) || undefined;
      }
    }
  }

  handleSelectedResource(event) {
    this.tool.tool = event;
    this.updatedToolEmit.emit(this.tool);
  }

  handleSuggestionsWeight(event) {
    this.tool.suggestionsWeight = event;
    this.updatedToolEmit.emit(this.tool);
  }

  handleDeleteResource(): void {
    this.deleteTool.emit(this.tool.id);
  }
}
