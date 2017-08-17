import {Component, Input, OnInit} from '@angular/core';
import {ResourceService} from '../../service/resource.service';
import {Resource} from '../../models/resource';
import {Attachment} from '../../models/attachment';
import {FileUploader} from 'ng2-file-upload';
import {Constants} from '../../constants';
import {WindowRefService} from '../../models/window-ref-service';

@Component({
  selector: 'admin-attachments',
  templateUrl: './attachments.component.html',
})
export class AttachmentsComponent implements OnInit {
  @Input() resources: Resource[];
  @Input() selectedFile;
  @Input() selectedResource: Resource;
  @Input() is_zipped: boolean;
  public uploader: FileUploader = new FileUploader({url: Constants.BASE_URL + 'attachments'});

  constructor(private resourceService: ResourceService,
              private windowRef: WindowRefService) {}

  ngOnInit(): void {
    this.resourceService.getResources('attachments').then(resources => this.resources = resources);
    this.is_zipped = false;
  }

  uploadNewFile(): void {
    const a = new Attachment();
    a.file = this.selectedFile;
    a.resource = this.selectedResource;
    a.is_zipped = this.is_zipped;

    this.uploader.authToken = this.windowRef.nativeWindow.localStorage.getItem('Authorization');
    this.uploader.options.additionalParameter = {is_zipped: this.is_zipped, resource_id: this.selectedResource.id};
    this.uploader.uploadAll();
  }
}
