import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {XmlEditorComponent} from './xml-editor.component';
import {DebugElement} from '@angular/core';
import {Resource} from '../../models/resource';
import {Language} from '../../models/language';
import {AceEditorDirective} from 'ng2-ace-editor';

describe('XmlEditorComponent', () => {
  let comp:    XmlEditorComponent;
  let fixture: ComponentFixture<XmlEditorComponent>;

  const saveForAllButton = (): DebugElement => {
    return fixture.debugElement.query(de => de.name === 'button' && de.nativeElement.textContent.trim() === 'Save for all languages');
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ XmlEditorComponent, AceEditorDirective ],
      imports: [ NgbModule.forRoot() ],
    }).compileComponents();

    fixture = TestBed.createComponent(XmlEditorComponent);
    comp = fixture.componentInstance;
    comp.resource = new Resource();
    comp.language = new Language();
  });

  it(`saves for one language when clicking 'Save (this language only)'`, () => {
    comp.language.code = 'en';
    spyOn(comp.onSaveForOne, 'emit');
    const element: DebugElement = fixture.debugElement.query(de => de.nativeElement.textContent.trim() === 'Save (this language only)');

    element.nativeElement.click();

    expect(comp.onSaveForOne.emit).toHaveBeenCalled();
  });

  it(`opens warning alert when clicking 'Save for all languages'`, () => {
    const filename = 'test.xml';
    comp.language.code = 'en';
    comp.filename = filename;
    fixture.detectChanges();

    const element: DebugElement = fixture.debugElement.query(de => de.nativeElement.textContent.trim() === 'Save for all languages');
    element.nativeElement.click();
    fixture.detectChanges();

    const confirmAlert: DebugElement = fixture.debugElement.query(de =>
      de.nativeElement.textContent.includes(`Are you sure you want to save this as the structure for ${filename} for all languages?`));
    expect(confirmAlert.nativeElement).toBeTruthy();
  });

  it(`saves for all languages when confirming save for all languages`, () => {
    const filename = 'test.xml';
    comp.language.code = 'en';
    comp.filename = filename;
    fixture.detectChanges();

    spyOn(comp.onSaveForAll, 'emit');
    const element: DebugElement = fixture.debugElement.query(de => de.nativeElement.textContent.trim() === 'Save for all languages');
    element.nativeElement.click();
    fixture.detectChanges();

    const confirmAlert: DebugElement = fixture.debugElement.query(de =>
      de.nativeElement.textContent.includes(`Are you sure you want to save this as the structure for ${filename} for all languages?`));
    const confirmButton: DebugElement = confirmAlert.query(de => de.nativeElement.textContent.trim() === 'Confirm');

    confirmButton.nativeElement.click();

    expect(comp.onSaveForAll.emit).toHaveBeenCalled();
  });

  it(`shows 'Save for All Languages' for English`, () => {
    comp.language.code = 'en';
    fixture.detectChanges();

    const element: DebugElement = saveForAllButton();

    expect(element.nativeElement).toBeTruthy();
  });

  it(`does not show 'Save for All Languages' for other languages`, () => {
    comp.language.code = 'fr';
    fixture.detectChanges();

    const element: DebugElement = saveForAllButton();

    expect(element === null).toBeTruthy();
  });

});
