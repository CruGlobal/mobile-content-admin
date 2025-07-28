import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AceEditorDirective } from 'ng2-ace-editor';
import { Page } from '../../models/page';
import { Resource } from '../../models/resource';
import { PageService } from '../../service/page.service';
import { XmlEditorComponent } from '../xml-editor/xml-editor.component';
import { PageComponent } from './page.component';

describe('PageComponent', () => {
  let comp: PageComponent;
  let fixture: ComponentFixture<PageComponent>;
  let xmlEditor: DebugElement;

  const pageServiceStub = ({
    update() {},
  } as unknown) as PageService;

  beforeEach(
    waitForAsync(() => {
      spyOn(pageServiceStub, 'update').and.returnValue(
        Promise.resolve<Page>(null),
      );

      TestBed.configureTestingModule({
        declarations: [PageComponent, XmlEditorComponent, AceEditorDirective],
        imports: [NgbModule, HttpClientTestingModule],
        providers: [
          { provide: PageService, useValue: pageServiceStub },
          { provide: NgbActiveModal },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponent);
    comp = fixture.componentInstance;
    comp.page = new Page();
    comp.page.resource = new Resource();
  });

  it('updates Page when XmlEditorComponent saves', (done) => {
    setTimeout(() => {
      fixture.detectChanges();
      xmlEditor = fixture.debugElement.query(
        (de) => de.name === 'admin-xml-editor',
      );

      xmlEditor.triggerEventHandler('onSave', 'emit');

      expect(pageServiceStub.update).toHaveBeenCalled();
      done();
    });
  });
});
