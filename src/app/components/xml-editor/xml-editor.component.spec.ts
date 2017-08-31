import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {XmlEditorComponent} from './xml-editor.component';
import {DebugElement} from '@angular/core';
import {Resource} from '../../models/resource';
import {Language} from '../../models/language';
import {AceEditorDirective} from 'ng2-ace-editor';

describe('XmlEditorComponent', () => {
  let comp: XmlEditorComponent;
  let fixture: ComponentFixture<XmlEditorComponent>;
  const filename = 'test.xml';

  const getConfirmSaveForAllAlert = (): DebugElement => {
    comp.language.code = comp.baseLanguageCode;
    fixture.detectChanges();

    getSaveForAllButton().nativeElement.click();
    fixture.detectChanges();

    return fixture.debugElement.query(de => de.nativeElement.textContent.includes(comp.getConfirmationMessage()));
  };

  const getSaveForAllButton = (): DebugElement => {
    return fixture.debugElement.query(de => de.name === 'button' && de.nativeElement.textContent.trim() === comp.saveForAllMessage);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [XmlEditorComponent, AceEditorDirective],
      imports: [NgbModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(XmlEditorComponent);
    comp = fixture.componentInstance;
    comp.resource = new Resource();
    comp.language = new Language();
    comp.filename = filename;
  });

  it(`saves for one language when clicking save for one language only`, () => {
    comp.language.code = comp.baseLanguageCode;
    fixture.detectChanges();
    spyOn(comp.onSaveForOne, 'emit');
    const element: DebugElement = fixture.debugElement.query(de => de.nativeElement.textContent.trim() === comp.saveForOneMessage);

    element.nativeElement.click();

    expect(comp.onSaveForOne.emit).toHaveBeenCalled();
  });

  it(`opens warning alert when clicking save for all languages`, () => {
    const confirmAlert: DebugElement = getConfirmSaveForAllAlert();

    expect(confirmAlert.nativeElement).toBeTruthy();
  });

  it(`saves for all languages when confirming save for all languages`, () => {
    spyOn(comp.onSaveForAll, 'emit');
    const confirmButton: DebugElement = getConfirmSaveForAllAlert().query(de => de.nativeElement.textContent.trim() === 'Confirm');

    confirmButton.nativeElement.click();

    expect(comp.onSaveForAll.emit).toHaveBeenCalled();
  });

  it(`shows save for all button for English`, () => {
    comp.language.code = comp.baseLanguageCode;
    fixture.detectChanges();

    const element: DebugElement = getSaveForAllButton();

    expect(element.nativeElement).toBeTruthy();
  });

  it(`does not show save for all button for other languages`, () => {
    comp.language.code = 'fr';
    fixture.detectChanges();

    const element: DebugElement = getSaveForAllButton();

    expect(element === null).toBeTruthy();
  });

});
