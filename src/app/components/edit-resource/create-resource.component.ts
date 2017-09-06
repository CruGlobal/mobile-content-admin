import {Component, Input, OnInit} from '@angular/core';
import {Resource} from '../../models/resource';
import {ResourceType} from '../../models/resource-type';
import {System} from '../../models/system';
import {ResourceService} from '../../service/resource.service';
import {SystemService} from '../../service/system.service';
import {ResourceTypeService} from '../../service/resource-type.service';
import {AbstractEditResourceComponent} from './abstract-edit-resource.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'admin-create-resource',
  templateUrl: './edit-resource.component.html'
})
export class CreateResourceComponent extends AbstractEditResourceComponent implements OnInit {
  @Input() resource: Resource = new Resource();
  resourceTypes: ResourceType[];
  systems: System[];

  constructor(private resourceService: ResourceService,
              systemService: SystemService,
              resourceTypeService: ResourceTypeService,
              activeModal: NgbActiveModal) {

    super(systemService, resourceTypeService, activeModal);
  }

  ngOnInit(): void {
    super.init(null, () => this.resource.system = this.systems[0]);
  }

  saveResource(): void {
    this.saving = true;

    this.resourceService.create(this.resource)
      .then(() => super.saveResource())
      .catch(error => super.handleError(error));
  }
}
