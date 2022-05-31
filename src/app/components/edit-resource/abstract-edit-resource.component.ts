import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Input, OnDestroy, ViewChild } from '@angular/core';
import { Resource } from '../../models/resource';
import { ResourceType } from '../../models/resource-type';
import { System } from '../../models/system';
import { SystemService } from '../../service/system.service';
import { ResourceTypeService } from '../../service/resource-type.service';
import { AceEditorDirective } from 'ng2-ace-editor';

export abstract class AbstractEditResourceComponent implements OnDestroy {
  saving = false;
  errorMessage: string;

  @ViewChild(AceEditorDirective) editor;

  @Input() resource: Resource = new Resource();
  resourceTypes: ResourceType[];
  systems: System[];

  protected constructor(
    protected systemService: SystemService,
    protected resourceTypeService: ResourceTypeService,
    protected activeModal: NgbActiveModal,
  ) {}

  init(resourceTypesCallback, systemsCallback): void {
    this.resourceTypeService.getResourceTypes().then((types) => {
      this.resourceTypes = types;

      if (resourceTypesCallback) {
        resourceTypesCallback.call();
      }
    });

    this.systemService.getSystems().then((systems) => {
      this.systems = systems;

      if (systemsCallback) {
        systemsCallback.call();
      }
    });
  }

  ngOnDestroy(): void {
    // HACK: workaround this bug: https://github.com/ajaxorg/ace/issues/4042
    //       ng2-ace-editor bundles an older version of ace that doesn't have this fix
    this.editor.editor.renderer.freeze();
  }

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  isMetaTool(): boolean {
    return Resource.isMetaTool(this.resource);
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = message;
  }

  protected saveResource(): void {
    this.activeModal.close('closed');
  }
}
