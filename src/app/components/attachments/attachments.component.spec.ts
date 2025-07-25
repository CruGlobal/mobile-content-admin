import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileSelectDirective } from 'ng2-file-upload';
import { NgArrayPipesModule } from 'ngx-pipes';
import { Attachment } from '../../models/attachment';
import { Resource } from '../../models/resource';
import { WindowRefService } from '../../models/window-ref-service';
import { AttachmentService } from '../../service/attachment.service';
import { AuthService } from '../../service/auth/auth.service';
import { ResourceService } from '../../service/resource/resource.service';
import { AttachmentsComponent } from './attachments.component';

describe('AttachmentsComponent', () => {
  let comp: AttachmentsComponent;
  let fixture: ComponentFixture<AttachmentsComponent>;

  const resourceServiceStub = {
    getResources() {
      return Promise.resolve();
    },
  };

  const authToken = 'c43ac439-99c8-4551-99a3-0cf53f4a4bcd';
  const windowRefStub = {
    nativeWindow: {
      sessionStorage: {
        getItem(key: string) {
          return key === 'Authorization' ? authToken : null;
        },
      },
    },
  };

  const modalServiceStub = ({
    open() {},
  } as unknown) as NgbModal;

  const file = 'roger.txt';
  const modalRef = ({
    componentInstance: {
      source: null,
    },
  } as unknown) as NgbModalRef;

  beforeEach(() => {
    spyOn(modalServiceStub, 'open').and.returnValue(modalRef);

    TestBed.configureTestingModule({
      declarations: [AttachmentsComponent, FileSelectDirective],
      imports: [
        NgbModule,
        FormsModule,
        NgArrayPipesModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ResourceService, useValue: resourceServiceStub },
        { provide: WindowRefService, useValue: windowRefStub },
        { provide: NgbModal, useValue: modalServiceStub },
        AuthService,
        AttachmentService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AttachmentsComponent);
    comp = fixture.componentInstance;

    const a = new Attachment();
    a.file = file;
    const attachments: Attachment[] = [a];
    const r = new Resource();
    r.attachments = attachments;
    comp.resources = [r];

    fixture.detectChanges();
  });

  it('includes auth header with file uploads', () => {
    spyOn(comp.uploader, 'uploadAll');

    comp.uploadNewFile();

    expect(comp.uploader.authToken).toBe(authToken);
  });

  describe('image modal', () => {
    beforeEach(() => {
      fixture.debugElement
        .query(By.css('.btn.btn-secondary'))
        .nativeElement.click();
    });

    it('is opened when view button is clicked', () => {
      expect(modalServiceStub.open).toHaveBeenCalled();
    });

    it('has its source set as the file', () => {
      expect(modalRef.componentInstance.source).toBe(file);
    });
  });
});
