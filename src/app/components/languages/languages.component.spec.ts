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
        updateLanguage() {
          return Promise.resolve(new Language());
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

  it('should show success alert after successfully updating a language', (done) => {
    comp.updateLanguage(new Language());

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

  it('should keep saving true and close the edit row once the reload completes', (done) => {
    const languageService = TestBed.inject(LanguageService);
    let resolveReload: (languages: Language[]) => void;
    spyOn(languageService, 'getLanguages').and.returnValue(
      new Promise((resolve) => (resolveReload = resolve)),
    );
    const language = new Language();
    language.isEditing = true;
    comp.languages = [language];

    comp.updateLanguage({ ...language });

    setTimeout(() => {
      expect(comp.saving).toBe(true);

      resolveReload([new Language()]);

      setTimeout(() => {
        expect(comp.saving).toBe(false);
        expect(comp.languages.some((l) => l.isEditing)).toBe(false);
        done();
      });
    });
  });

  it('should show error message when updating a language fails', (done) => {
    const languageService = TestBed.inject(LanguageService);
    spyOn(languageService, 'updateLanguage').and.returnValue(
      Promise.reject('update failed'),
    );
    const language = new Language();
    language.isEditing = true;

    comp.updateLanguage(language);

    setTimeout(() => {
      expect(comp.errorMessage).toBe('update failed');
      expect(comp.saving).toBe(false);
      expect(language.isEditing).toBe(true);
      done();
    });
  });

  it('should render an accessible name on the force-language-name checkboxes', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      const language = comp.languages[0];
      language.name = 'French';
      fixture.detectChanges();

      const viewCheckbox = fixture.debugElement.query(
        By.css('.container input[type="checkbox"][disabled]'),
      );
      expect(viewCheckbox.nativeElement.getAttribute('aria-label')).toBe(
        'Force language name for French',
      );

      language.isEditing = true;
      comp.editedLanguage = { ...language };
      fixture.detectChanges();

      const editCheckbox = fixture.debugElement.query(
        By.css('.container input[type="checkbox"]:not([disabled])'),
      );
      expect(editCheckbox.nativeElement.getAttribute('aria-label')).toBe(
        'Force language name for French',
      );

      done();
    });
  });

  it('should only allow editing one language at a time', () => {
    const languageOne = new Language();
    const languageTwo = new Language();
    comp.languages = [languageOne, languageTwo];

    comp.editLanguage(languageOne);
    comp.editLanguage(languageTwo);

    expect(languageOne.isEditing).toBe(false);
    expect(languageTwo.isEditing).toBe(true);
  });

  it('should edit a clone so typing does not mutate the original row', () => {
    const languageOne = new Language();
    languageOne.name = 'French';
    const languageTwo = new Language();
    languageTwo.name = 'German';
    comp.languages = [languageOne, languageTwo];

    comp.editLanguage(languageOne);
    comp.editedLanguage.name = 'Français';

    expect(comp.editedLanguage).not.toBe(languageOne);
    expect(languageOne.name).toBe('French');

    comp.editLanguage(languageTwo);

    expect(comp.editedLanguage.name).toBe('German');
  });

  it('should discard unsaved edits when cancelling', () => {
    const language = new Language();
    language.name = 'French';
    comp.languages = [language];

    comp.editLanguage(language);
    comp.editedLanguage.name = 'Français';
    comp.cancelEdit(language);

    expect(language.isEditing).toBe(false);
    expect(language.name).toBe('French');
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
