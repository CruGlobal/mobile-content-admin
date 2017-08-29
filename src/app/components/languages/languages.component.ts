import {Component, Input, OnInit} from '@angular/core';
import {Language} from '../../models/language';
import {LanguageService} from '../../service/language.service';

@Component({
  selector: 'admin-languages',
  templateUrl: './languages.component.html'
})
export class LanguagesComponent implements OnInit {
  @Input() name: string;
  @Input() code: string;
  newLanguage: Language = new Language();
  languages: Language[];

  private errorMessage: string;
  private loading = false;
  private saving = false;
  private success = false;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.loadLanguages();
  }

  private handleError(errors): void {
    this.errorMessage = errors[0].detail;
  }

  private loadLanguages(): void {
    this.loading = true;

    this.languageService.getLanguages()
      .then(languages => this.languages = languages)
      .catch(errors => this.handleError(errors))
      .then(() => this.loading = false);
  }

  createLanguage(): void {
    this.saving = true;

    this.languageService.createLanguage(this.newLanguage)
      .then(() => {
        this.showSuccess();
        this.loadLanguages();
      })
      .catch(errors => this.handleError(errors))
      .then(() => this.saving = false);
  }

  deleteLanguage(language: Language): void {
    this.languageService.deleteLanguage(language.id)
      .then(() => {
        this.showSuccess();
        this.loadLanguages();
      })
      .catch(errors => this.handleError(errors));
  }

  protected showConfirmButton(language: Language): void {
    this.languages.forEach(l => l.canConfirmDelete = false);
    language.canConfirmDelete = true;
  }

  private showSuccess(): void {
    this.success = true;
    setTimeout(() => this.success = false, 2000);
  }
}
