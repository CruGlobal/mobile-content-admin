import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { environment } from '../../environments/environment';
import { Language } from '../models/language';
import { AbstractService } from './abstract.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class LanguageService extends AbstractService {
  private readonly languagesUrl = environment.base_url + 'languages';

  constructor(private http: HttpClient, private authService: AuthService) {
    super();
  }

  getLanguages(): Promise<Language[]> {
    return this.http
      .get(this.languagesUrl)
      .toPromise()
      .then((response) => {
        return new JsonApiDataStore().sync(response);
      })
      .catch(this.handleError);
  }

  getLanguage(id: number, include: string): Promise<Language> {
    return this.http
      .get(`${this.languagesUrl}/${id}?include=${include}`)
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }

  createLanguage(language: Language): Promise<Language> {
    const payload = {
      data: {
        type: 'language',
        attributes: {
          name: language.name,
          code: language.code,
        },
      },
    };

    return this.http
      .post(
        this.languagesUrl,
        payload,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .then((response) => new JsonApiDataStore().sync(response))
      .catch(this.handleError);
  }

  deleteLanguage(id: number): Promise<void> {
    return this.http
      .delete(
        `${this.languagesUrl}/${id}`,
        this.authService.getAuthorizationAndOptions(),
      )
      .toPromise()
      .catch(this.handleError);
  }
}
