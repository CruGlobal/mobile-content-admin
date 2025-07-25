import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Input, OnDestroy, ViewChild, Directive } from '@angular/core';
import { Resource } from '../../models/resource';
import { ResourceType } from '../../models/resource-type';
import { System } from '../../models/system';
import { SystemService } from '../../service/system.service';
import { ResourceTypeService } from '../../service/resource-type.service';
import { AceEditorDirective } from 'ng2-ace-editor';
import { ResourceService } from '../../service/resource/resource.service';

@Directive()
export abstract class AbstractEditResourceComponent implements OnDestroy {
  saving = false;
  errorMessage: string;

  @ViewChild(AceEditorDirective) editor;

  @Input() resource: Resource = new Resource();
  metatools: Resource[];
  resourceTypes: ResourceType[];
  systems: System[];

  protected constructor(
    protected systemService: SystemService,
    protected resourceTypeService: ResourceTypeService,
    protected resourceService: ResourceService,
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

    this.resourceService.getResources().then((tools) => {
      this.metatools = tools.filter((tool) => Resource.isMetaTool(tool));
    });
  }

  ngOnDestroy(): void {
    // HACK: workaround this bug: https://github.com/ajaxorg/ace/issues/4042
    //       ng2-ace-editor uses brace@0.11.1 which bundles an older version of ace without the fix
    this.editor?.editor?.renderer?.freeze();
  }

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  isMetaTool(): boolean {
    return Resource.isMetaTool(this.resource);
  }

  compareTools(o1: any, o2: any): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = message;
  }

  protected saveResource(): void {
    this.activeModal.close('closed');
  }
}
