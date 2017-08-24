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
  languages: Language[];

  private error = false;
  private loading = false;
  private saving = false;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.loadLanguages();
  }

  private handleError(error: any): void {
    console.error(error);
    this.error = true;
  }

  private loadLanguages(): void {
    this.loading = true;

    this.languageService.getLanguages()
      .then(languages => this.languages = languages)
      .catch(error => this.handleError(error))
      .then(() => this.loading = false);
  }

  createLanguage(): void {
    const l: Language = new Language();
    l.name = this.name;
    l.code = this.code;

    this.languageService.createLanguage(l)
      .then(() => this.loadLanguages())
      .catch(error => this.handleError(error));
  }

  deleteLanguage(language: Language): void {
    this.languageService.deleteLanguage(language.id)
      .then(() => this.loadLanguages())
      .catch(error => this.handleError(error));
  }
}
