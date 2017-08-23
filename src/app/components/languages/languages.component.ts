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

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.loadLanguages();
  }

  private loadLanguages(): void {
    this.languageService.getLanguages().then(languages => this.languages = languages);
  }

  createLanguage(): void {
    const l: Language = new Language();
    l.name = this.name;
    l.code = this.code;

    this.languageService.createLanguage(l).then(() => this.loadLanguages());
  }

  deleteLanguage(language: Language): void {
    this.languageService.deleteLanguage(language.id)
      .then(() => this.loadLanguages())
      .catch();
  }
}
