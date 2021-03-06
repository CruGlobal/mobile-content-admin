import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { XmlEditorComponent } from '../xml-editor/xml-editor.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AceEditorDirective } from 'ng2-ace-editor';
import { PageService } from '../../service/page.service';
import { Page } from '../../models/page';
import { PageComponent } from './page.component';
import { Resource } from '../../models/resource';

describe('PageComponent', () => {
  let comp: PageComponent;
  let fixture: ComponentFixture<PageComponent>;
  let xmlEditor: DebugElement;

  const pageServiceStub = ({
    update() {},
  } as unknown) as PageService;

  beforeEach(async(() => {
    spyOn(pageServiceStub, 'update').and.returnValue(
      Promise.resolve<Page>(null),
    );

    TestBed.configureTestingModule({
      declarations: [PageComponent, XmlEditorComponent, AceEditorDirective],
      imports: [NgbModule.forRoot()],
      providers: [
        { provide: PageService, useValue: pageServiceStub },
        { provide: NgbActiveModal },
      ],
    }).compileComponents();
  }));

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
