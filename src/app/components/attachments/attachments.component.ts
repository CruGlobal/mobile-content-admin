import {Component, Input, OnInit} from '@angular/core';
import {ResourceService} from '../../service/resource.service';
import {Resource} from '../../models/resource';

@Component({
  selector: 'admin-attachments',
  templateUrl: './attachments.component.html',
})
export class AttachmentsComponent implements OnInit {
  @Input() resources: Resource[];

  constructor(private resourceService: ResourceService) {}

  ngOnInit(): void {
    this.resourceService.getResources().then(resources => this.resources = resources);
  }
}
