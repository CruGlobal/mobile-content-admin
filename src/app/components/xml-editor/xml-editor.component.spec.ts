import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { XmlEditorComponent } from './xml-editor.component';
import { DebugElement } from '@angular/core';
import { Resource } from '../../models/resource';
import { Language } from '../../models/language';
import { AceEditorDirective } from 'ng2-ace-editor';

describe('XmlEditorComponent', () => {
  let comp: XmlEditorComponent;
  let fixture: ComponentFixture<XmlEditorComponent>;
  const filename = 'test.xml';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [XmlEditorComponent, AceEditorDirective],
      imports: [NgbModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(XmlEditorComponent);
    comp = fixture.componentInstance;
    comp.resource = new Resource();
    comp.language = new Language();
    comp.filename = filename;
  });

  it('saves when clicking save', () => {
    fixture.detectChanges();
    spyOn(comp.onSave, 'emit');
    const element: DebugElement = fixture.debugElement.query(
      (de) => de.nativeElement.textContent.trim() === comp.saveMessage,
    );

    element.nativeElement.click();

    expect(comp.onSave.emit).toHaveBeenCalled();
  });

  it('cancels when clicking cancel', () => {
    fixture.detectChanges();
    spyOn(comp.onCancel, 'emit');
    const element: DebugElement = fixture.debugElement.query(
      (de) => de.nativeElement.textContent.trim() === comp.cancelMessage,
    );

    element.nativeElement.click();

    expect(comp.onCancel.emit).toHaveBeenCalled();
  });
});
