import {Component, Input, OnInit} from '@angular/core';
import {Resource} from '../../models/resource';
import {ResourceType} from '../../models/resource-type';
import {System} from '../../models/system';
import {ResourceService} from '../../service/resource.service';
import {SystemService} from '../../service/system.service';
import {ResourceTypeService} from '../../service/resource-type.service';

@Component({
  selector: 'admin-edit-resource',
  templateUrl: './edit-resource.component.html'
})
export class EditResourceComponent implements OnInit {
  @Input() resource: Resource;
  resourceTypes: ResourceType[];
  systems: System[];

  constructor(private resourceService: ResourceService,
              private systemService: SystemService,
              private resourceTypeService: ResourceTypeService) {}

  ngOnInit(): void {
    if (this.resource == null) {
      this.resource = new Resource();
    }

    this.resourceTypeService.getResourceTypes().then(types => this.resourceTypes = types);
    this.systemService.getSystems().then(systems => {
      this.systems = systems;
      this.resource.system = this.systems[0];
    });
  }

  saveResource(): void {
    if (this.resource.id == null) {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  private createResource(): void {
    this.resourceService.create(this.resource).then();
  }

  private updateResource(): void {
    this.resourceService.update(this.resource).then();
  }
}
