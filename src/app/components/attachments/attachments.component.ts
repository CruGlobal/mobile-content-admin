import {Component, Input, OnInit} from '@angular/core';
import {ResourceService} from '../../service/resource.service';
import {Resource} from '../../models/resource';
import {Attachment} from '../../models/attachment';
import {FileUploader} from 'ng2-file-upload';
import {WindowRefService} from '../../models/window-ref-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImageComponent} from '../image/image.component';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'admin-attachments',
  templateUrl: './attachments.component.html',
})
export class AttachmentsComponent implements OnInit {
  @Input() resources: Resource[];
  @Input() selectedFile;
  @Input() selectedResource: Resource;
  @Input() is_zipped: boolean;
  public uploader: FileUploader = new FileUploader({url: environment.base_url + 'attachments'});

  private errorMessage: string;
  private loading = false;

  constructor(private resourceService: ResourceService, private windowRef: WindowRefService, private modalService: NgbModal) {}

  private handleError(errors): void {
    this.errorMessage = errors[0].detail;
  }

  ngOnInit(): void {
    this.loadAttachments();
    this.is_zipped = false;

    this.uploader.onCompleteAll = () => {
      this.loadAttachments();
    };

    this.uploader.onErrorItem = (_item, response) => {
      this.errorMessage = JSON.parse(response).errors[0].detail;
    };
  }

  private loadAttachments(): void {
    this.loading = true;

    this.resourceService.getResources('attachments')
      .then(resources => this.resources = resources)
      .catch(errors => this.handleError(errors))
      .then(() => this.loading = false);
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

  showAttachment(attachment: Attachment): void {
    this.modalService.open(ImageComponent).componentInstance.source = attachment.file;
  }
}
