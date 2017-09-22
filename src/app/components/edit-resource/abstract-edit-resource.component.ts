import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Input} from '@angular/core';
import {Resource} from '../../models/resource';
import {ResourceType} from '../../models/resource-type';
import {System} from '../../models/system';
import {SystemService} from '../../service/system.service';
import {ResourceTypeService} from '../../service/resource-type.service';

export abstract class AbstractEditResourceComponent {
  saving = false;
  errorMessage: string;

  @Input() resource: Resource = new Resource();
  resourceTypes: ResourceType[];
  systems: System[];

  constructor(protected systemService: SystemService,
              protected resourceTypeService: ResourceTypeService,
              protected activeModal: NgbActiveModal) {}

  init(resourceTypesCallback, systemsCallback): void {
    this.resourceTypeService.getResourceTypes().then(types => {
      this.resourceTypes = types;

      if (resourceTypesCallback) {
        resourceTypesCallback.call();
      }
    });

    this.systemService.getSystems().then(systems => {
      this.systems = systems;

      if (systemsCallback) {
        systemsCallback.call();
      }
    });
  }

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = message;
  }

  protected saveResource(): void {
    this.activeModal.close('closed');
  }
}
