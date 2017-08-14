import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import {Resource} from '../../models/resource';
import {ResourceService} from '../../service/resource.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'admin-resource-detail',
  templateUrl: './resource-detail.component.html'
})
export class ResourceDetailComponent implements OnInit {
  @Input() resource: Resource;

  constructor(
    private resourceService: ResourceService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.resourceService.getResource(+params.get('id')))
      .subscribe(resource => this.resource = resource);
  }
  goBack(): void {
    this.location.back();
  }
  save(): void {
    this.resourceService.update(this.resource)
      .then(() => this.goBack());
  }
}
