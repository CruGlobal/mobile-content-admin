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

  it('shows Save for All Languages for English', () => {
    comp.language.code = 'en';
    fixture.detectChanges();

    const element: DebugElement = saveForAllButton();

    expect(element.nativeElement).toBeTruthy();
  });

  it('does not show Save for All Languages for other languages', () => {
    comp.language.code = 'fr';
    fixture.detectChanges();

    const element: DebugElement = saveForAllButton();

    expect(element === null).toBeTruthy();
  });

});
