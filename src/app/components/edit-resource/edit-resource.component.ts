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
export class EditResourceComponent implements OnInit{
  newResource: Resource = new Resource;
  resourceTypes: ResourceType[];
  systems: System[];

  constructor(private resourceService: ResourceService,
              private systemService: SystemService,
              private resourceTypeService: ResourceTypeService) {}

  ngOnInit(): void {
    this.resourceTypeService.getResourceTypes().then(types => this.resourceTypes = types);
    this.systemService.getSystems().then(systems => {
      this.systems = systems;
      this.newResource.system = this.systems[0];
    });
  }

  createResource(): void {
    console.log(this.newResource);
    this.resourceService.create(this.newResource).then();
  }
}
