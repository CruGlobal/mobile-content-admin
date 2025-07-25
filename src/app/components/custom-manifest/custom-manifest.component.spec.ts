import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomManifestComponent } from './custom-manifest.component';
import { DebugElement } from '@angular/core';
import { XmlEditorComponent } from '../xml-editor/xml-editor.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AceEditorDirective } from 'ng2-ace-editor';
import { CustomManifestService } from '../../service/custom-manifest.service';
import { CustomManifest } from '../../models/custom-manifest';
import { Language } from '../../models/language';
import { Resource } from '../../models/resource';

describe('CustomManifestComponent', () => {
  let comp: CustomManifestComponent;
  let fixture: ComponentFixture<CustomManifestComponent>;
  let xmlEditor: DebugElement;

  const customManifestServiceStub = ({
    upsert() {},
    delete() {},
  } as unknown) as CustomManifestService;

  beforeEach(
    waitForAsync(() => {
      spyOn(customManifestServiceStub, 'upsert').and.returnValue(
        Promise.resolve<CustomManifest>(null),
      );

      TestBed.configureTestingModule({
        declarations: [
          CustomManifestComponent,
          XmlEditorComponent,
          AceEditorDirective,
        ],
        imports: [NgbModule, HttpClientTestingModule],
        providers: [
          {
            provide: CustomManifestService,
            useValue: customManifestServiceStub,
          },
          { provide: NgbActiveModal },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomManifestComponent);
    comp = fixture.componentInstance;
    comp.customManifest = new CustomManifest();
    comp.customManifest.language = new Language();
    comp.customManifest.resource = new Resource();
    comp.customManifest.structure =
      '<manifest xmlns="https://mobile-content-api.cru.org/xmlns/manifest"></manifest>';
  });

  it('updates existing CustomManifest when XmlEditorComponent saves', (done) => {
    setTimeout(() => {
      fixture.detectChanges();
      xmlEditor = fixture.debugElement.query(
        (de) => de.name === 'admin-xml-editor',
      );

      xmlEditor.triggerEventHandler('onSave', 'emit');

      expect(customManifestServiceStub.upsert).toHaveBeenCalled();
      done();
    });
  });
});
