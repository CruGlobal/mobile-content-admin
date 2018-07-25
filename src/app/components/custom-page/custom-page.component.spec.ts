import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CustomPageComponent} from './custom-page.component';
import {DebugElement} from '@angular/core';
import {XmlEditorComponent} from '../xml-editor/xml-editor.component';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AceEditorDirective} from 'ng2-ace-editor';
import {CustomPageService} from '../../service/custom-page.service';
import {PageService} from '../../service/page.service';
import {CustomPage} from '../../models/custom-page';
import {Language} from '../../models/language';
import {Page} from '../../models/page';
import {DraftService} from '../../service/draft.service';
import {Resource} from '../../models/resource';

describe('CustomPageComponent', () => {
  let comp:    CustomPageComponent;
  let fixture: ComponentFixture<CustomPageComponent>;
  let xmlEditor: DebugElement;

  const customPageServiceStub = {
    upsert() {}
  };
  const pageServiceStub = {
    update() {}
  };
  const draftServiceStub = {
    getPage() { return Promise.resolve('xml response'); }
  };

  beforeEach(async(() => {
    spyOn(customPageServiceStub, 'upsert').and.returnValue(Promise.resolve());
    spyOn(pageServiceStub, 'update').and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      declarations: [ CustomPageComponent, XmlEditorComponent, AceEditorDirective ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        {provide: PageService, useValue: pageServiceStub},
        {provide: CustomPageService, useValue: customPageServiceStub},
        {provide: DraftService, useValue: draftServiceStub},
        {provide: NgbActiveModal}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPageComponent);
    comp = fixture.componentInstance;
    comp.customPage = new CustomPage();
    comp.customPage.language = new Language();
    comp.customPage.page = new Page();
    comp.customPage.page.resource = new Resource();
  });

  it('updates existing CustomPage when XmlEditorComponent saves for one', (done) => {
    comp.ngOnInit();

    setTimeout(() => {
      fixture.detectChanges();
      xmlEditor = fixture.debugElement.query(de => de.name === 'admin-xml-editor');

      xmlEditor.triggerEventHandler('onSave', 'emit');

      expect(customPageServiceStub.upsert).toHaveBeenCalled();
      done();
    });
  });

  it('updates Page when XmlEditorComponent saves for all', (done) => {
    comp.ngOnInit();

    setTimeout(() => {
      fixture.detectChanges();
      xmlEditor = fixture.debugElement.query(de => de.name === 'admin-xml-editor');

      xmlEditor.triggerEventHandler('onSaveForAll', 'emit');

      expect(pageServiceStub.update).toHaveBeenCalled();
      done();
    });
  });

});
