import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Language} from '../models/language';
import {AuthService} from './auth/auth.service';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {environment} from '../../environments/environment';
import {AbstractService} from './abstract.service';

@Injectable()
export class LanguageService extends AbstractService {
  private readonly languagesUrl = environment.base_url + 'languages';

  constructor(private http: Http, private authService: AuthService) {
    super();
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
