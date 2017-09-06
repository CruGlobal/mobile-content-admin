import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AttachmentsComponent} from './attachments.component';
import {ResourceService} from '../../service/resource.service';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {WindowRefService} from '../../models/window-ref-service';
import {AttachmentService} from '../../service/attachment.service';
import {Resource} from '../../models/resource';
import {Attachment} from '../../models/attachment';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {FileSelectDirective} from 'ng2-file-upload';

describe('AttachmentsComponent', () => {
  let comp:    AttachmentsComponent;
  let fixture: ComponentFixture<AttachmentsComponent>;

  const resourceServiceStub = {
    getResources() { return Promise.resolve(); }
  };

  const modalServiceStub = {
    open() {}
  };

  beforeEach(() => {
    spyOn(modalServiceStub, 'open');

    TestBed.configureTestingModule({
      declarations: [ AttachmentsComponent, FileSelectDirective ],
      imports: [ NgbModule.forRoot(), FormsModule ],
      providers: [
        {provide: ResourceService, useValue: resourceServiceStub},
        {provide: WindowRefService},
        {provide: NgbModal, useValue: modalServiceStub},
        {provide: AttachmentService},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AttachmentsComponent);
    comp = fixture.componentInstance;

    const a = new Attachment();
    const attachments: Attachment[] = [ a ];
    const r = new Resource();
    r.attachments = attachments;
    comp.resources = [r];

    fixture.detectChanges();
  });

  it('opens modal with image when view button is clicked', () => {
    fixture.debugElement.query(By.css('.btn.btn-secondary')).nativeElement.click();

    expect(modalServiceStub.open).toHaveBeenCalled();
  });
});
