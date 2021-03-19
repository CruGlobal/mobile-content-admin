import { Component, Input, OnInit } from '@angular/core';
import { Resource } from '../../../models/resource';
import { ResourceType } from '../../../models/resource-type';
import { System } from '../../../models/system';
import { ResourceService } from '../../../service/resource/resource.service';
import { SystemService } from '../../../service/system.service';
import { ResourceTypeService } from '../../../service/resource-type.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractEditResourceComponent } from '../abstract-edit-resource.component';

@Component({
  selector: 'admin-edit-resource',
  templateUrl: '../edit-resource.component.html',
})
export class UpdateResourceComponent
  extends AbstractEditResourceComponent
  implements OnInit {
  @Input() resource: Resource;
  resourceTypes: ResourceType[];
  systems: System[];

  constructor(
    private resourceService: ResourceService,
    systemService: SystemService,
    resourceTypeService: ResourceTypeService,
    activeModal: NgbActiveModal,
  ) {
    super(systemService, resourceTypeService, activeModal);
  }

  ngOnInit(): void {
    super.init(
      () =>
        (this.resource.resourceType = this.resourceTypes.find(
          (type) => type.name === this.resource['resource-type'],
        )),
      () =>
        (this.resource.system = this.systems.find(
          (system) => system.id === this.resource.system.id,
        )),
    );

    this.resource.oneskyProjectId = this.resource['onesky-project-id'];
    this.resource.aboutOverviewVideoYoutube = this.resource[
      'attr-about-overview-video-youtube'
    ];
    this.resource.banner = this.resource['attr-banner'];
    this.resource.bannerAbout = this.resource['attr-banner-about'];
  }

  saveResource(): void {
    this.saving = true;

    this.resourceService
      .update(this.resource)
      .then(() => super.saveResource())
      .catch((error) => super.handleError(error));
  }
}
