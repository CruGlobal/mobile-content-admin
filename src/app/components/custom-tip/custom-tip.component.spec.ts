import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AceEditorDirective } from 'ng2-ace-editor';
import { CustomTip } from '../../models/custom-tip';
import { Language } from '../../models/language';
import { Resource } from '../../models/resource';
import { Tip } from '../../models/tip';
import { CustomTipService } from '../../service/custom-tip.service';
import { DraftService } from '../../service/draft.service';
import { XmlEditorComponent } from '../xml-editor/xml-editor.component';
import { CustomTipComponent } from './custom-tip.component';

describe('CustomTipComponent', () => {
  let comp: CustomTipComponent;
  let fixture: ComponentFixture<CustomTipComponent>;
  let xmlEditor: DebugElement;

  const customTipServiceStub = ({
    upsert() {},
  } as unknown) as CustomTipService;
  const draftServiceStub = {
    getTip() {
      return Promise.resolve('xml response');
    },
  };

  beforeEach(
    waitForAsync(() => {
      spyOn(customTipServiceStub, 'upsert').and.returnValue(
        Promise.resolve<CustomTip>(null),
      );

      TestBed.configureTestingModule({
        declarations: [
          CustomTipComponent,
          XmlEditorComponent,
          AceEditorDirective,
        ],
        imports: [NgbModule, HttpClientTestingModule],
        providers: [
          { provide: CustomTipService, useValue: customTipServiceStub },
          { provide: DraftService, useValue: draftServiceStub },
          { provide: NgbActiveModal },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTipComponent);
    comp = fixture.componentInstance;
    comp.customTip = new CustomTip();
    comp.customTip.language = new Language();
    comp.customTip.tip = new Tip();
    comp.customTip.tip.resource = new Resource();
  });

  it('updates existing CustomTip when XmlEditorComponent saves', (done) => {
    comp.ngOnInit();

    setTimeout(() => {
      fixture.detectChanges();
      xmlEditor = fixture.debugElement.query(
        (de) => de.name === 'admin-xml-editor',
      );

      xmlEditor.triggerEventHandler('onSave', 'emit');

      expect(customTipServiceStub.upsert).toHaveBeenCalled();
      done();
    });
  });
});
