import {Component, Input, OnInit} from '@angular/core';
import {ResourceService} from '../../service/resource.service';
import {Resource} from '../../models/resource';
import {Attachment} from '../../models/attachment';
import {FileUploader} from 'ng2-file-upload';
import {WindowRefService} from '../../models/window-ref-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImageComponent} from '../image/image.component';
import {environment} from '../../../environments/environment';
import {AttachmentService} from '../../service/attachment.service';

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
  private success = false;

  constructor(private resourceService: ResourceService,
              private windowRef: WindowRefService,
              private modalService: NgbModal,
              private attachmentService: AttachmentService) {}

  ngOnInit(): void {
    this.loadAttachments();
    this.is_zipped = false;

    this.uploader.onCompleteAll = () => {
      this.showSuccess();
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
      .catch(this.handleError.bind(this))
      .then(() => this.loading = false);
  }

  uploadNewFile(): void {
    const resourceId = this.selectedResource ? this.selectedResource.id : null;

    this.uploader.authToken = this.windowRef.nativeWindow.localStorage.getItem('Authorization');
    this.uploader.options.additionalParameter = {is_zipped: this.is_zipped, resource_id: resourceId};
    this.uploader.uploadAll();
  }

  showAttachment(attachment: Attachment): void {
    this.modalService.open(ImageComponent).componentInstance.source = attachment.file;
  }

  deleteAttachment(attachment: Attachment): void {
    this.attachmentService.deleteAttachment(attachment.id)
      .then(() => {
        this.showSuccess();
        this.loadAttachments();
      })
      .catch(this.handleError.bind(this));
  }

  protected showConfirmButton(attachment: Attachment): void {
    this.resources.forEach(r => r.attachments.forEach(a => a.canConfirmDelete = false));
    attachment.canConfirmDelete = true;
  }

  private showSuccess(): void {
    this.success = true;
    setTimeout(() => this.success = false, 2000);
  }

  private handleError(message: string): void {
    this.errorMessage = message;
  }
}
