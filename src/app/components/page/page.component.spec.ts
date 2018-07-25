import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {XmlEditorComponent} from '../xml-editor/xml-editor.component';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AceEditorDirective} from 'ng2-ace-editor';
import {CustomPageService} from '../../service/custom-page.service';
import {PageService} from '../../service/page.service';
import {Page} from '../../models/page';
import {PageComponent} from './page.component';
import {Translation} from '../../models/translation';
import {Language} from '../../models/language';
import {DraftService} from '../../service/draft.service';
import {Resource} from '../../models/resource';

describe('PageComponent', () => {
  let comp:    PageComponent;
  let fixture: ComponentFixture<PageComponent>;
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
      declarations: [ PageComponent, XmlEditorComponent, AceEditorDirective ],
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
    fixture = TestBed.createComponent(PageComponent);
    comp = fixture.componentInstance;
    comp.translation = new Translation();
    comp.translation.language = new Language();
    comp.page = new Page();
    comp.page.resource = new Resource();
  });

  it('creates new CustomPage when XmlEditorComponent saves for one', (done) => {
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
