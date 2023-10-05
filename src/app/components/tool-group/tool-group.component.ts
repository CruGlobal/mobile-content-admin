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
import { ToolGroup } from '../../models/tool-group';
import { UpdateResourceComponent } from '../edit-resource/update-resource/update-resource.component';
import { ToolGroupsComponent } from '../tool-groups/tool-groups.component';

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
  errorMessage: string;

  private _translationLoaded = new Subject<number>();
  translationLoaded$ = this._translationLoaded.asObservable();

  constructor(
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    console.log('toolGrouptoolGroup', this.toolGroup);
  }

  ngOnDestroy(): void {
    this._translationLoaded.complete();
  }

   openUpdateModal(toolGroup: ToolGroup): void {
    const modalRef: NgbModalRef = this.modalService.open(
      UpdateResourceComponent,
      { size: 'lg' },
    );
    modalRef.componentInstance.toolGroup = toolGroup;
    modalRef.result.then(
      () => this.toolGroupsComponent.loadToolGroups(),
      console.log,
    );
  }

  private handleError(message): void {
    this.errorMessage = message;
  }
}
