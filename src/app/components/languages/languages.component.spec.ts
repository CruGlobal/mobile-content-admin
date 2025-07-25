import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Language } from '../../models/language';
import { LanguageService } from '../../service/language.service';
import { LanguagesComponent } from './languages.component';

describe('LanguagesComponent', () => {
  let comp: LanguagesComponent;
  let fixture: ComponentFixture<LanguagesComponent>;

  beforeEach(
    waitForAsync(() => {
      const languageServiceStub = {
        deleteLanguage() {
          return Promise.resolve();
        },
        getLanguages() {
          return Promise.resolve([new Language()]);
        },
      };

      TestBed.configureTestingModule({
        declarations: [LanguagesComponent],
        imports: [NgbModule, FormsModule, HttpClientTestingModule],
        providers: [
          { provide: LanguageService, useValue: languageServiceStub },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagesComponent);
    comp = fixture.componentInstance;
  });

  it('should show success alert after successfully deleting a language', (done) => {
    comp.deleteLanguage(new Language());

    setTimeout(() => {
      fixture.detectChanges();

      const elements: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(NgbAlert),
      );
      const successAlert = elements.find(
        (e) => e.attributes.type === 'success',
      );
      expect(successAlert.nativeElement.textContent.trim()).toBe('Success!');

      done();
    });
  });
});
