import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ResourceService } from '../../service/resource/resource.service';
import { Resource } from '../../models/resource';
import { Attachment } from '../../models/attachment';
import { FileUploader } from 'ng2-file-upload';
import { WindowRefService } from '../../models/window-ref-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageComponent } from '../image/image.component';
import { environment } from '../../../environments/environment';
import { AttachmentService } from '../../service/attachment.service';

@Component({
  selector: 'admin-attachments',
  templateUrl: './attachments.component.html',
})
export class AttachmentsComponent implements OnInit {
  @ViewChild('uploadElement') uploadElement: ElementRef;

  @Input() resources: Resource[];
  @Input() selectedFile;
  @Input() selectedResource: Resource;
  public uploader: FileUploader = new FileUploader({
    url: environment.base_url + 'attachments',
  });

  showInstructions = false;
  loading = false;
  success = false;
  errorMessages: string[];
  fileName: String = '';

  constructor(
    private resourceService: ResourceService,
    private windowRef: WindowRefService,
    private modalService: NgbModal,
    private attachmentService: AttachmentService,
  ) {}

  ngOnInit(): void {
    this.loadAttachments();

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.showSuccess();
      this.loadAttachments();
      return { item, response, status, headers };
    };

    this.uploader.onErrorItem = (item, response, status, headers) => {
      const errorText =
        JSON.parse(response).errors[0].detail || 'Unknown error occured';
      this.errorMessages = [...this.errorMessages, errorText];
      return { item, response, status, headers };
    };
  }

  private loadAttachments(): void {
    this.loading = true;

    this.resourceService
      .getResources('attachments')
      .then(
        (resources) =>
          (this.resources = resources.filter(
            (tool) => !Resource.isMetaTool(tool),
          )),
      )
      .catch(this.handleError.bind(this))
      .then(() => (this.loading = false));
  }

  uploadNewFile(): void {
    this.errorMessages = [];

    const resourceId = this.selectedResource ? this.selectedResource.id : null;

    this.uploader.authToken = this.windowRef.nativeWindow.sessionStorage.getItem(
      'Authorization',
    );
    this.uploader.options.additionalParameter = { resource_id: resourceId };
    this.uploader.uploadAll();
  }

  showAttachment(attachment: Attachment): void {
    this.modalService.open(ImageComponent).componentInstance.source =
      attachment.file;
  }

  deleteAttachment(attachment: Attachment): void {
    this.attachmentService
      .deleteAttachment(attachment.id)
      .then(() => {
        this.showSuccess();
        this.loadAttachments();
      })
      .catch(this.handleError.bind(this));
  }

  protected showConfirmButton(attachment: Attachment): void {
    this.resources.forEach((r) =>
      r.attachments.forEach((a) => (a.canConfirmDelete = false)),
    );
    attachment.canConfirmDelete = true;
  }

  private showSuccess(): void {
    this.success = true;
    setTimeout(() => (this.success = false), 2000);
  }

  private handleError(message: string): void {
    this.errorMessages = [message];
  }
}
