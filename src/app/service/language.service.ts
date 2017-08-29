import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Language} from '../models/language';
import {AuthService} from './auth.service';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {environment} from '../../environments/environment';

@Injectable()
export class LanguageService {
  private readonly languagesUrl = environment.base_url + 'languages';

  constructor(private http: Http, private authService: AuthService) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.json().errors);
  }

  getLanguages(): Promise<Language[]> {
    return this.http.get(this.languagesUrl)
      .toPromise()
      .then(response => {
        return new JsonApiDataStore().sync(response.json());
      })
      .catch(this.handleError);
  }

  getLanguage(id: number, include: string): Promise<Language> {
    return this.http.get(`${this.languagesUrl}/${id}?include=${include}`)
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }

  createLanguage(language: Language): Promise<Language> {
    const payload = {
      data: {
        type: 'language',
        attributes: {
          name: language.name,
          code: language.code
        }
      }
    };

    return this.http.post(this.languagesUrl, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }

  deleteLanguage(id: number): Promise<void> {
    return this.http.delete(`${this.languagesUrl}/${id}`, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .catch(this.handleError);
  }
}
