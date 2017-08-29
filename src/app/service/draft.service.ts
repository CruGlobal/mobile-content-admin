import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Translation} from '../models/translation';
import {AuthService} from './auth.service';
import {JsonApiDataStore} from 'jsonapi-datastore';
import {Page} from '../models/page';
import {environment} from '../../environments/environment';

@Injectable()
export class DraftService {
  private readonly draftsUrl = environment.base_url + 'drafts';

  constructor(private http: Http, private authService: AuthService) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.json().errors);
  }

  canGetDrafts(): Promise<boolean> {
    return this.http.get(this.draftsUrl, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(() => true)
      .catch(() => Promise.reject(false));
  }

  getPage(page: Page, translation: Translation): Promise<string> {
    return this.http.get(`${this.draftsUrl}/${translation.id}/?page_id=${page.id}`, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(response => {
        return response.text();
      })
      .catch(this.handleError);
  }

  createDraft(resourceId: number, languageId: number): Promise<void> {
    const body = `{"data": {"attributes": {"resource_id": ${resourceId}, "language_id": ${languageId}}}}`;

    return this.http.post(this.draftsUrl, body, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .catch(this.handleError);
  }

  updateDraft(translation: Translation): Promise<Translation> {
    const payload = {
      data: {
        type: 'translation',
        attributes: {
          is_published: translation.is_published
        }
      }
    };

    return this.http.put(`${this.draftsUrl}/${translation.id}`, payload, this.authService.getAuthorizationAndOptions())
      .toPromise()
      .then(response => new JsonApiDataStore().sync(response.json()))
      .catch(this.handleError);
  }
}
