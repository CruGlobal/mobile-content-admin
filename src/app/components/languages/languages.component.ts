import { Component, Input, OnInit } from '@angular/core';
import { Language } from '../../models/language';
import { LanguageService } from '../../service/language.service';

@Component({
  selector: 'admin-languages',
  templateUrl: './languages.component.html',
})
export class LanguagesComponent implements OnInit {
  @Input() name: string;
  @Input() code: string;
  newLanguage: Language = new Language();
  languages: Language[];

  loading = false;
  saving = false;
  success = false;
  errorMessage: string;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.loadLanguages();
  }

  private handleError(message): void {
    this.errorMessage = message;
  }

  private loadLanguages(): void {
    this.loading = true;

    this.languageService
      .getLanguages()
      .then((languages) => (this.languages = languages))
      .catch(this.handleError.bind(this))
      .then(() => (this.loading = false));
  }

  createLanguage(): void {
    this.saving = true;
    this.errorMessage = null;

    this.languageService
      .createLanguage(this.newLanguage)
      .then(() => {
        this.showSuccess();
        this.loadLanguages();
      })
      .catch(this.handleError.bind(this))
      .then(() => (this.saving = false));
  }

  deleteLanguage(language: Language): void {
    this.errorMessage = null;
    language.canConfirmDelete = false;

    this.languageService
      .deleteLanguage(language.id)
      .then(() => {
        this.showSuccess();
        this.loadLanguages();
      })
      .catch(this.handleError.bind(this));
  }

  protected showConfirmButton(language: Language): void {
    this.languages.forEach((l) => (l.canConfirmDelete = false));
    language.canConfirmDelete = true;
  }

  showSuccess(): void {
    this.success = true;
    setTimeout(() => (this.success = false), 2000);
  }
}
