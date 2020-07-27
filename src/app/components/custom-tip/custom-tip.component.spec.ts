import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CustomTipComponent} from './custom-tip.component';
import {DebugElement} from '@angular/core';
import {XmlEditorComponent} from '../xml-editor/xml-editor.component';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AceEditorDirective} from 'ng2-ace-editor';
import {CustomTipService} from '../../service/custom-tip.service';
import {CustomTip} from '../../models/custom-tip';
import {Language} from '../../models/language';
import {Tip} from '../../models/tip';
import {DraftService} from '../../service/draft.service';
import {Resource} from '../../models/resource';

describe('CustomTipComponent', () => {
  let comp:    CustomTipComponent;
  let fixture: ComponentFixture<CustomTipComponent>;
  let xmlEditor: DebugElement;

  const customTipServiceStub = {
    upsert() {}
  } as unknown as CustomTipService;
  const draftServiceStub = {
    getTip() { return Promise.resolve('xml response'); }
  };

  beforeEach(async(() => {
    spyOn(customTipServiceStub, 'upsert').and.returnValue(Promise.resolve<CustomTip>(null));

    TestBed.configureTestingModule({
      declarations: [ CustomTipComponent, XmlEditorComponent, AceEditorDirective ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        {provide: CustomTipService, useValue: customTipServiceStub},
        {provide: DraftService, useValue: draftServiceStub},
        {provide: NgbActiveModal}
      ]
    }).compileComponents();
  }));

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
      xmlEditor = fixture.debugElement.query(de => de.name === 'admin-xml-editor');

      xmlEditor.triggerEventHandler('onSave', 'emit');

      expect(customTipServiceStub.upsert).toHaveBeenCalled();
      done();
    });
  });
});
