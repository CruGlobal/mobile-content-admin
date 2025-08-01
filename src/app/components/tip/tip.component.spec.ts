import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AceEditorDirective } from 'ng2-ace-editor';
import { Resource } from '../../models/resource';
import { Tip } from '../../models/tip';
import { TipService } from '../../service/tip.service';
import { XmlEditorComponent } from '../xml-editor/xml-editor.component';
import { TipComponent } from './tip.component';

describe('TipComponent', () => {
  let comp: TipComponent;
  let fixture: ComponentFixture<TipComponent>;
  let xmlEditor: DebugElement;

  const tipServiceStub = ({
    update() {},
  } as unknown) as TipService;

  beforeEach(
    waitForAsync(() => {
      spyOn(tipServiceStub, 'update').and.returnValue(
        Promise.resolve<Tip>(null),
      );

      TestBed.configureTestingModule({
        declarations: [TipComponent, XmlEditorComponent, AceEditorDirective],
        imports: [NgbModule, HttpClientTestingModule],
        providers: [
          { provide: TipService, useValue: tipServiceStub },
          { provide: NgbActiveModal },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TipComponent);
    comp = fixture.componentInstance;
    comp.tip = new Tip();
    comp.tip.resource = new Resource();
  });

  it('updates Tip when XmlEditorComponent saves', (done) => {
    setTimeout(() => {
      fixture.detectChanges();
      xmlEditor = fixture.debugElement.query(
        (de) => de.name === 'admin-xml-editor',
      );

      xmlEditor.triggerEventHandler('onSave', 'emit');

      expect(tipServiceStub.update).toHaveBeenCalled();
      done();
    });
  });
});
